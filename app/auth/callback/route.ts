import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Use NEXT_PUBLIC_SITE_URL in production, fallback to request origin for development
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_SITE_URL
    : requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
    } else if (data?.user) {
      try {
        // Find the user in our database
        const dbUser = await prisma.user.findUnique({
          where: { supabaseId: data.user.id }
        });

        if (dbUser) {
          // Update the Supabase user metadata with our database ID
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              app_user_id: dbUser.id,
            }
          });

          if (updateError) {
            console.error("Error updating Supabase user metadata:", updateError);
          }
        }
      } catch (err) {
        console.error("Error updating user metadata:", err);
        // Continue with redirect even if metadata update fails
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${baseUrl}${redirectTo}`);
  }

  return NextResponse.redirect(`${baseUrl}/p/home`);
}
