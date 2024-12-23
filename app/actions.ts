"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||  
                 'http://localhost:3001';
  if (!email || !password || !firstName || !lastName) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email, password, first name, and last name are required",
    );
  }

  if (password.length < 8) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Password must be at least 8 characters long"
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        firstName,
        lastName,
      },
    },
  });

  if (error) {
    console.error("Supabase signup error:", error.code, error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (!data.user) {
    console.error("No user data returned from Supabase");
    return encodedRedirect("error", "/sign-up", "Failed to create account");
  }

  console.log("Supabase auth signup successful:", data.user.id);

  try {
    // Check for existing user but don't error immediately
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: data.user.id }
    });

    if (existingUser) {
      console.log("User already exists in database, proceeding with existing user");
      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }

    console.log("Creating new user in database...");
    const userData = await prisma.user.create({
      data: {
        email,
        supabaseId: data.user.id,
        firstName,
        lastName,
      },
    });

    console.log("User created in database:", userData.id);
    
    // Move the redirect outside of the try/catch since it's not an error
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );

  } catch (err) {
    // Add check to ignore redirect "errors"
    if ((err as any)?.message === 'NEXT_REDIRECT') {
      throw err; // Let Next.js handle the redirect
    }
    
    console.error("Database error:", err);
    // Only delete the Supabase user if we failed to create the database entry
    try {
      await supabase.auth.admin.deleteUser(data.user.id);
    } catch (deleteErr) {
      console.error("Failed to delete Supabase user after error:", deleteErr);
    }
    return encodedRedirect(
      "error",
      "/sign-up",
      "Failed to create user account. Please try again."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/p/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ||  
                 'http://localhost:3001';

  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/p/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/p/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/p/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/p/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/p/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
