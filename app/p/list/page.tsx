import { Suspense } from "react";
import { getWishes } from "@/app/data/wish";
import { getCurrentUser } from "@/app/data/user";
import WishListSkeleton from "@/components/shared/wish-list-skeleton";
import WishListClient from "@/components/wish-list-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function ListPage() {
  const { wishes, error: wishError } = await getWishes();
  const { id: userId, error: userError } = await getCurrentUser();

  const error = userError || wishError;

  return (
    <div className="container max-w-6xl py-6">
      <Suspense fallback={<WishListSkeleton />}>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <WishListClient wishes={wishes} userId={userId} />
        )}
      </Suspense>
    </div>
  );
}