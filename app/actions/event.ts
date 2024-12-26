"use server";

import { prisma } from "@/lib/prisma";
import { encodedRedirect } from "@/utils/utils";
import { getCurrentUser } from "@/app/data/user";
import { revalidatePath } from "next/cache";

export const createEventAction = async (formData: FormData) => {
  try {
    const { id: userId, error: userError } = await getCurrentUser();
    if (userError || !userId) {
      return encodedRedirect("error", "/sign-in", "You must be signed in to create an event");
    }

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const date = formData.get("date")?.toString();
    const isRecurring = formData.get("isRecurring") === "on";
    const recurringType = formData.get("recurringType")?.toString();
    const groupId = formData.get("groupId")?.toString();

    if (!title || !date) {
      return encodedRedirect("error", "/p/events/new", "Title and date are required");
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        isRecurring,
        recurringType: isRecurring && recurringType ? (recurringType as any) : null,
        groupId: groupId || null,
        creatorId: userId,
      },
    });

    revalidatePath('/p/events');
    return encodedRedirect("success", "/p/events", "Event created successfully");
  } catch (error) {
    if ((error as any)?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error("Error creating event:", error);
    return encodedRedirect("error", "/p/events/new", "Failed to create event");
  }
};

export const updateEventAction = async (eventId: string, formData: FormData) => {
  try {
    const { id: userId, error: userError } = await getCurrentUser();
    if (userError || !userId) {
      return encodedRedirect("error", "/sign-in", "You must be signed in to update an event");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.creatorId !== userId) {
      return encodedRedirect("error", "/p/events", "Not authorized to update this event");
    }

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const date = formData.get("date")?.toString();
    const isRecurring = formData.get("isRecurring") === "on";
    const recurringType = formData.get("recurringType")?.toString();
    const groupId = formData.get("groupId")?.toString();

    if (!title || !date) {
      return encodedRedirect("error", `/p/events/${eventId}/edit`, "Title and date are required");
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        date: new Date(date),
        isRecurring,
        recurringType: isRecurring && recurringType ? (recurringType as any) : null,
        groupId: groupId || null,
      },
    });

    revalidatePath('/p/events');
    return encodedRedirect("success", "/p/events", "Event updated successfully");
  } catch (error) {
    if ((error as any)?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error("Error updating event:", error);
    return encodedRedirect("error", `/p/events/${eventId}/edit`, "Failed to update event");
  }
};

export const deleteEventAction = async (eventId: string) => {
  try {
    const { id: userId, error: userError } = await getCurrentUser();
    if (userError || !userId) {
      return { error: "Not authenticated" };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.creatorId !== userId) {
      return { error: "Not authorized to delete this event" };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath('/p/events');
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error: "Failed to delete event" };
  }
}; 