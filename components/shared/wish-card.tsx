'use client';

import { Wish } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

type WishWithRelations = Wish & {
    user: {
        firstName: string;
        lastName: string;
        imageUrl: string | null;
    };
    event: {
        title: string;
        date: Date;
    } | null;
};

interface WishCardProps {
    wish: WishWithRelations;
    className?: string;
}

export default function WishCard({ wish, className }: WishCardProps) {
    if (!wish) return null;

    const userInitials = wish.user ? `${wish.user.firstName?.[0] || ''}${wish.user.lastName?.[0] || ''}` : '??';
    const userName = wish.user ? `${wish.user.firstName} ${wish.user.lastName}`.trim() : 'Unknown User';
    
    return (
        <Card className={className}>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={wish.user?.imageUrl || undefined} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{userName}</span>
                </div>
                <h3 className="font-medium mb-1">{wish.title || 'Untitled Wish'}</h3>
                {wish.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {wish.description}
                    </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {wish.event && (
                            <>
                                <span>{wish.event.title}</span>
                                <span>•</span>
                                <span>{format(new Date(wish.event.date), 'MMM d')}</span>
                            </>
                        )}
                    </div>
                    {typeof wish.price === 'number' && (
                        <span className="font-medium">${wish.price.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </Card>
    );
}

export type { WishWithRelations }; 