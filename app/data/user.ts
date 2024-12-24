"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export type UserData = {
  id: string;
  error?: string;
};

export const getCurrentUser = cache(async (): Promise<UserData> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { id: "", error: "Authentication failed" };
    }

    if (!user) {
      return { id: "", error: "Not authenticated" };
    }

    // First check the metadata for the app_user_id
    const appUserId = user.user_metadata.app_user_id;
    if (appUserId) {
      return { id: appUserId };
    }

    // If not in metadata, get from database
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return { id: "", error: "User not found" };
    }

    // Update the user metadata with the app_user_id for future use
    await supabase.auth.updateUser({
      data: { app_user_id: dbUser.id },
    });

    return { id: dbUser.id };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { id: "", error: "Failed to get user data" };
  }
}); 