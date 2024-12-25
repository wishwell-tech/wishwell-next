"use server";

import { prisma } from "@/lib/prisma";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/data/user";

interface CreateGroupInput {
  name: string;
  description?: string;
  imageUrl?: string;
}

export async function createGroup(input: CreateGroupInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to create a group"
    );
  }

  if (!input.name) {
    return encodedRedirect(
      "error",
      "/p/people/new-group",
      "Group name is required"
    );
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return encodedRedirect("error", "/p/people/new-group", "User not found");
    }

    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        creatorId: dbUser.id,
        members: {
          create: {
            userId: dbUser.id,
            role: "ADMIN",
          },
        },
      },
    });

    revalidatePath("/p/people");
    return encodedRedirect(
      "success",
      "/p/people",
      "Group created successfully"
    );
  } catch (error) {
    // Check if this is a redirect error (which is actually success)
    if ((error as any)?.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle the redirect
    }

    console.error("Error creating group:", error);
    return encodedRedirect(
      "error",
      "/p/people/new-group",
      "Failed to create group"
    );
  }
}

export async function deleteGroupAction(groupId: string) {
  try {
    const { id: userId, error } = await getCurrentUser();

    if (error || !userId) {
      return { error: error || "Not authenticated" };
    }

    // Verify the user is the creator or admin of the group
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
    });

    if (!group || (group.creatorId !== userId && group.members.length === 0)) {
      return { error: "Not authorized to delete this group" };
    }

    // Delete the group and all related members
    await prisma.group.delete({
      where: { id: groupId },
    });

    revalidatePath("/p/people");
    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    return { error: "Failed to delete group" };
  }
}

export async function updateGroupAction(groupId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to edit a group"
    );
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (!name) {
    return encodedRedirect(
      "error",
      `/p/people/groups/${groupId}/edit`,
      "Group name is required"
    );
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return encodedRedirect(
        "error",
        `/p/people/groups/${groupId}/edit`,
        "User not found"
      );
    }

    // Verify the user is the creator or admin of the group
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: {
            userId: dbUser.id,
            role: "ADMIN",
          },
        },
      },
    });

    if (
      !group ||
      (group.creatorId !== dbUser.id && group.members.length === 0)
    ) {
      return encodedRedirect(
        "error",
        "/p/people",
        "Not authorized to edit this group"
      );
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        name,
        description,
        imageUrl,
      },
    });

    revalidatePath("/p/people");
    return encodedRedirect(
      "success",
      "/p/people",
      "Group updated successfully"
    );
  } catch (error) {
    if ((error as any)?.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Error updating group:", error);
    return encodedRedirect(
      "error",
      `/p/people/groups/${groupId}/edit`,
      "Failed to update group"
    );
  }
}
