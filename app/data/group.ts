"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { Prisma } from "@prisma/client";

// Define the shape of what we're querying with Prisma
const groupWithRelations = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: {
    members: {
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
            nickname: true,
          },
        },
      },
    },
    creator: {
      select: {
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    },
  },
});

// Extract the type from our validator
export type GroupWithRelations = Prisma.GroupGetPayload<typeof groupWithRelations>;

export type GetGroupsResponse = {
  groups: GroupWithRelations[];
  error?: string;
};

export const getGroups = cache(async (): Promise<GetGroupsResponse> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { groups: [], error: "Authentication failed" };
    }

    if (!user) {
      return { groups: [], error: "Not authenticated" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return { groups: [], error: "User not found" };
    }

    // Get all groups where the user is a member
    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { creatorId: dbUser.id },
          {
            members: {
              some: {
                userId: dbUser.id,
              },
            },
          },
        ],
      },
      include: groupWithRelations.include,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { groups };
  } catch (error) {
    console.error("Error fetching groups:", error);
    return { groups: [], error: "Failed to fetch groups" };
  }
});

export const getGroup = cache(async (groupId: string): Promise<{ group: GroupWithRelations | null; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { group: null, error: "Not authenticated" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return { group: null, error: "User not found" };
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: groupWithRelations.include,
    });

    if (!group) {
      return { group: null, error: "Group not found" };
    }

    // Verify membership
    const isMember = group.members.some(member => member.userId === dbUser.id) || 
                    group.creatorId === dbUser.id;

    if (!isMember) {
      return { group: null, error: "Not authorized" };
    }

    return { group };
  } catch (error) {
    console.error("Error fetching group:", error);
    return { group: null, error: "Failed to fetch group" };
  }
}); 