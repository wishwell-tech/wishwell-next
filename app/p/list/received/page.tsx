import { Suspense } from "react";
import Link from "next/link";
import { getWishes } from "@/app/data/wish";
import { getCurrentUser } from "@/app/data/user";
import WishCard from "@/components/shared/wish-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function ReceivedWishesPage() {
  const { wishes, error: wishError } = await getWishes();
  const { id: userId, error: userError } = await getCurrentUser();

  const error = userError || wishError;
  const receivedWishes = wishes.filter(wish => wish.received);

  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="Received Wishes" />
        <Button variant="outline" asChild>
          <Link href="/p/list">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wishes
          </Link>
        </Button>
      </div>

      <Suspense fallback={<WishListSkeleton />}>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : receivedWishes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No received wishes yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedWishes.map((wish) => (
              <WishCard 
                key={wish.id} 
                wish={wish} 
                currentUserId={userId}
                hideActions={true}
              />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}

function WishListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
} 