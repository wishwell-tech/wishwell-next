import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { Prisma } from "@prisma/client";

// Define the exact shape of what we're querying with Prisma
const wishWithRelations = Prisma.validator<Prisma.WishDefaultArgs>()({
  include: {
    user: {
      select: {
        firstName: true,
        lastName: true,
        imageUrl: true,
      },
    },
    event: {
      select: {
        title: true,
        date: true,
      },
    },
  },
  select: {
    id: true,
    title: true,
    description: true,
    price: true,
    url: true,
    priority: true,
    createdAt: true,
    updatedAt: true,
    completed: true,
    received: true,
    userId: true,
    reserverId: true,
    eventId: true,
  },
});

// Extract the type from our validator
export type WishWithRelations = Prisma.WishGetPayload<typeof wishWithRelations>;

export type GetWishesResponse = {
  wishes: WishWithRelations[];
  error?: string;
};

export const getWishes = cache(async (): Promise<GetWishesResponse> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { wishes: [], error: "Authentication failed" };
    }

    if (!user) {
      return { wishes: [], error: "Not authenticated" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return { wishes: [], error: "User not found" };
    }

    const wishes = await prisma.wish.findMany({
      where: {
        userId: dbUser.id,
      },
      include: wishWithRelations.include,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { wishes };
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return { wishes: [], error: "Failed to fetch wishes" };
  }
});

export const getWish = cache(async (wishId: string): Promise<{ wish: WishWithRelations | null; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { wish: null, error: "Not authenticated" };
    }

    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
      include: wishWithRelations.include,
    });

    if (!wish) {
      return { wish: null, error: "Wish not found" };
    }

    // Verify ownership
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser || wish.userId !== dbUser.id) {
      return { wish: null, error: "Not authorized" };
    }

    return { wish };
  } catch (error) {
    console.error("Error fetching wish:", error);
    return { wish: null, error: "Failed to fetch wish" };
  }
}); 