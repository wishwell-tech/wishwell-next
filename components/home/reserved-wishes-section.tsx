'use client';

import { useState } from "react";
import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/shared/section-header";
import EmptyState from "@/components/shared/empty-state";
import { type WishWithRelations } from "@/app/data/wish";
import WishCard from "@/components/shared/wish-card";

function WishSkeleton() {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-3/4 h-4 mb-2" />
            <div className="flex justify-between">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-4" />
            </div>
        </Card>
    );
}

export default function ReservedWishesSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wishes, setWishes] = useState<WishWithRelations[]>([]);

    if (error) {
        return (
            <Card className="p-4">
                <div className="text-sm text-muted-foreground text-center">
                    {error}
                </div>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <SectionHeader title="Gifts You're Buying" />
                {[1, 2, 3].map((i) => (
                    <WishSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (wishes.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon={Gift}
                    title="No Reserved Wishes"
                    description="You haven't reserved any wishes to buy yet."
                    actionLabel="Find Wishes"
                    onAction={() => console.log('Find wishes')}
                />
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <SectionHeader 
                title="Gifts You're Buying" 
                actionLabel={wishes.length > 3 ? "View All" : undefined}
                onAction={() => console.log('View all wishes')}
            />
            {wishes.slice(0, 3).map((wish) => (
                <WishCard key={wish.id} wish={wish} />
            ))}
        </div>
    );
} 