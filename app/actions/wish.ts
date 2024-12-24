"use server";

import { prisma } from "@/lib/prisma";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/data/user";

export const createWishAction = async (formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to create a wish");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priceStr = formData.get("price")?.toString();
  const url = formData.get("url")?.toString();
  const priorityStr = formData.get("priority")?.toString();

  if (!title) {
    return encodedRedirect("error", "/p/list/new-wish", "Title is required");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return encodedRedirect("error", "/p/list/new-wish", "User not found");
    }

    const price = priceStr ? parseFloat(priceStr) : null;
    const priority = priorityStr ? parseInt(priorityStr) : null;

    await prisma.wish.create({
      data: {
        title,
        description,
        price,
        url,
        priority,
        userId: dbUser.id,
      },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return encodedRedirect("success", "/p/list", "Wish created successfully");
  } catch (error) {
    // Check if this is a redirect error (which is actually success)
    if ((error as any)?.message === 'NEXT_REDIRECT') {
      throw error; // Let Next.js handle the redirect
    }
    
    console.error("Error creating wish:", error);
    return encodedRedirect("error", "/p/list/new-wish", "Failed to create wish");
  }
};

export const reserveWishAction = async (wishId: string) => {
  try {
    const { id: userId, error } = await getCurrentUser();

    if (error || !userId) {
      return { error: error || "Not authenticated" };
    }

    await prisma.wish.update({
      where: { id: wishId },
      data: { reserverId: userId },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error reserving wish:", error);
    return { error: "Failed to reserve wish" };
  }
};

export const releaseWishAction = async (wishId: string) => {
  try {
    await prisma.wish.update({
      where: { id: wishId },
      data: { reserverId: null },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error releasing wish:", error);
    return { error: "Failed to release wish" };
  }
};

export const completeWishAction = async (wishId: string) => {
  try {
    await prisma.wish.update({
      where: { id: wishId },
      data: { completed: true },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error completing wish:", error);
    return { error: "Failed to complete wish" };
  }
};

export const deleteWishAction = async (wishId: string) => {
  try {
    await prisma.wish.delete({
      where: { id: wishId },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error deleting wish:", error);
    return { error: "Failed to delete wish" };
  }
};

export const updateWishAction = async (wishId: string, formData: FormData) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in to edit a wish");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priceStr = formData.get("price")?.toString();
  const url = formData.get("url")?.toString();
  const priorityStr = formData.get("priority")?.toString();

  if (!title) {
    return encodedRedirect("error", `/p/wishes/${wishId}/edit`, "Title is required");
  }

  try {
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
      include: { user: true },
    });

    if (!wish) {
      return encodedRedirect("error", "/p/list", "Wish not found");
    }

    if (wish.user.supabaseId !== user.id) {
      return encodedRedirect("error", "/p/list", "You can only edit your own wishes");
    }

    const price = priceStr ? parseFloat(priceStr) : null;
    const priority = priorityStr ? parseInt(priorityStr) : null;

    await prisma.wish.update({
      where: { id: wishId },
      data: {
        title,
        description,
        price,
        url,
        priority,
      },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return encodedRedirect("success", "/p/list", "Wish updated successfully");
  } catch (error) {
    if ((error as any)?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error("Error updating wish:", error);
    return encodedRedirect("error", `/p/wishes/${wishId}/edit`, "Failed to update wish");
  }
};

export const markWishAsReceivedAction = async (wishId: string) => {
  try {
    const { id: userId, error } = await getCurrentUser();

    if (error || !userId) {
      return { error: error || "Not authenticated" };
    }

    // Verify the wish belongs to the user
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
    });

    if (!wish || wish.userId !== userId) {
      return { error: "Not authorized" };
    }

    await prisma.wish.update({
      where: { id: wishId },
      data: { received: true },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error marking wish as received:", error);
    return { error: "Failed to mark wish as received" };
  }
};

export const toggleWishReceivedAction = async (wishId: string) => {
  try {
    const { id: userId, error } = await getCurrentUser();

    if (error || !userId) {
      return { error: error || "Not authenticated" };
    }

    // Verify the wish belongs to the user
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
    });

    if (!wish || wish.userId !== userId) {
      return { error: "Not authorized" };
    }

    await prisma.wish.update({
      where: { id: wishId },
      data: { 
        received: !wish.received,
        // If we're marking as not received, also clear the completed status
        completed: wish.received ? false : wish.completed
      },
    });

    revalidatePath('/p/list');
    revalidatePath('/p/wishes');
    return { success: true };
  } catch (error) {
    console.error("Error toggling wish received status:", error);
    return { error: "Failed to update wish" };
  }
}; 