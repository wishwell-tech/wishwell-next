"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import WishCard from "@/components/shared/wish-card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import EmptyState from "@/components/shared/empty-state";
import { getWishes, type WishWithRelations } from "@/app/data/wish";
import { getCurrentUser } from "@/app/data/user";


export default function WishListClient() {
  const [wishes, setWishes] = useState<WishWithRelations[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { wishes, error: wishError } = await getWishes();
      const { id: userId, error: userError } = await getCurrentUser();

      setWishes(wishes);
      setUserId(userId);
      // setError(userError || wishError);
    };
    fetchData();
  }, []);

  const [showAllReceived, setShowAllReceived] = useState(false);

  // Split wishes into open and received
  const openWishes = wishes.filter((wish) => !wish.received);
  const receivedWishes = wishes.filter((wish) => wish.received);
  const displayedReceivedWishes = showAllReceived
    ? receivedWishes
    : receivedWishes.slice(0, 3);

  if (wishes.length === 0) {
    return (
      <EmptyState
        title="No wishes yet"
        description="Create your first wish to get started"
        action={
          <Button asChild>
            <Link href="/p/list/new-wish">
              <Plus className="w-4 h-4 mr-2" />
              New Wish
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">

      {/* Open Wishes Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Open Wishes</h2>
        {openWishes.length === 0 ? (
          <p className="text-muted-foreground">No open wishes</p>
        ) : (
          <div className="space-y-4">
            {openWishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                currentUserId={userId || undefined}
                hideActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Received Wishes Section */}
      {receivedWishes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Received Wishes</h2>
          <div className="space-y-4">
            {displayedReceivedWishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                currentUserId={userId || undefined}
                hideActions={true}
              />
            ))}
          </div>
          {receivedWishes.length > 3 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAllReceived(!showAllReceived)}
            >
              {showAllReceived ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show All Received ({receivedWishes.length})
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
