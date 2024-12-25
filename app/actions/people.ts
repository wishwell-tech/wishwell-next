"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/data/user";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const invitePersonAction = async (formData: FormData) => {
  try {
    const { id: inviterId, error: userError } = await getCurrentUser();
    if (userError || !inviterId) {
      return { error: "Not authenticated" };
    }

    const email = formData.get("email")?.toString().toLowerCase();
    const groupId = formData.get("groupId")?.toString();

    if (!email) {
      return { error: "Email is required" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If they're already a member, just add them to the group if specified
    if (existingUser && !existingUser.isPending) {
      if (groupId) {
        // Check if they're already in the group
        const existingMembership = await prisma.groupMember.findUnique({
          where: {
            userId_groupId: {
              userId: existingUser.id,
              groupId,
            },
          },
        });

        if (existingMembership) {
          return { error: "This person is already a member of this group" };
        }

        // Add them to the group
        await prisma.groupMember.create({
          data: {
            userId: existingUser.id,
            groupId,
            role: "MEMBER",
          },
        });

        revalidatePath('/p/people');
        return { success: true };
      }
      return { error: "This person is already a Wishwell user" };
    }

    // If user exists but is pending, we can update the invitation
    if (existingUser && existingUser.isPending) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          invitedBy: inviterId,
          invitedAt: new Date(),
        },
      });

      // Add to group if specified
      if (groupId) {
        await prisma.groupMember.create({
          data: {
            userId: existingUser.id,
            groupId,
            role: "MEMBER",
          },
        });
      }
    } else {
      // Create new pending user
      const newUser = await prisma.user.create({
        data: {
          email,
          isPending: true,
          invitedBy: inviterId,
          invitedAt: new Date(),
        },
      });

      // Add to group if specified
      if (groupId) {
        await prisma.groupMember.create({
          data: {
            userId: newUser.id,
            groupId,
            role: "MEMBER",
          },
        });
      }
    }

    // After creating/updating the user, send the invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?email=${email}`;
    
    const {data, error} = await resend.emails.send({
      from: 'Wishwell <noreply@wishwell.org>',
      to: [email],
      subject: 'You\'ve been invited to Wishwell',
      html: `
        <h1>Welcome to Wishwell!</h1>
        <p>You've been invited to join Wishwell. Click the link below to get started:</p>
        <a href="${inviteUrl}">Accept Invitation</a>
      `
    });

    if (error) {
      console.error("Error sending invitation email:", error);
      return { error: "Failed to send invitation" };
    }

    console.log("Invitation email sent successfully:", data);

    revalidatePath('/p/people');
    return { success: true };
  } catch (error) {
    console.error("Error inviting person:", error);
    return { error: "Failed to send invitation" };
  }
}; 