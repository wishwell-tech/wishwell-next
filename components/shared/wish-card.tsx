"use client";

import { type WishWithRelations } from "@/app/data/wish";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Check, Gift } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  reserveWishAction,
  releaseWishAction,
  completeWishAction,
  deleteWishAction,
  markWishAsReceivedAction,
  toggleWishReceivedAction,
} from "@/app/actions/wish";
import { useToast } from "@/hooks/use-toast";

interface WishCardProps {
  wish: WishWithRelations;
  className?: string;
  currentUserId?: string;
  hideActions?: boolean;
}

export default function WishCard({
  wish,
  className,
  currentUserId,
  hideActions,
}: WishCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (!wish) return null;

  const userInitials = wish.user
    ? `${wish.user.firstName?.[0] || ""}${wish.user.lastName?.[0] || ""}`
    : "??";
  const userName = wish.user
    ? `${wish.user.firstName} ${wish.user.lastName}`.trim()
    : "Unknown User";
  const isReserved = Boolean(wish.reserverId);
  const isReservedByMe = wish.reserverId === currentUserId;
  const isMyWish = wish.userId === currentUserId;

  const handleReserveToggle = async () => {
    setIsLoading(true);
    try {
      const result = isReserved
        ? await releaseWishAction(wish.id)
        : await reserveWishAction(wish.id);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: isReserved ? "Wish Released" : "Wish Reserved",
          description: isReserved
            ? "You have released this wish"
            : "You have reserved this wish",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wish reservation",
      });
    }
    setIsLoading(false);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const result = await completeWishAction(wish.id);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Wish Completed",
          description: "The wish has been marked as completed",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete wish",
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this wish?")) return;

    setIsLoading(true);
    try {
      const result = await deleteWishAction(wish.id);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Wish Deleted",
          description: "Your wish has been deleted",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete wish",
      });
    }
    setIsLoading(false);
  };

  const handleMarkAsReceived = async () => {
    setIsLoading(true);
    try {
      const result = await markWishAsReceivedAction(wish.id);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Wish Received",
          description: "The wish has been marked as received",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark wish as received",
      });
    }
    setIsLoading(false);
  };

  const handleToggleReceived = async () => {
    setIsLoading(true);
    try {
      const result = await toggleWishReceivedAction(wish.id);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: wish.received ? "Wish Reopened" : "Wish Received",
          description: wish.received 
            ? "The wish has been marked as not received" 
            : "The wish has been marked as received",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wish",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className={className}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={wish.user?.imageUrl || undefined} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
          </div>
          {isMyWish && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/p/wishes/${wish.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <h3 className="font-medium mb-1">{wish.title || "Untitled Wish"}</h3>
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
                <span>{format(new Date(wish.event.date), "MMM d")}</span>
              </>
            )}
          </div>
          {typeof wish.price === "number" && (
            <span className="font-medium">${wish.price.toFixed(2)}</span>
          )}
        </div>

        {!hideActions && !isMyWish && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={isReserved ? "secondary" : "default"}
              size="sm"
              className="flex-1"
              onClick={handleReserveToggle}
              disabled={isLoading}
            >
              {isReserved
                ? isReservedByMe
                  ? "Release"
                  : "Reserved"
                : "Reserve"}
            </Button>

            {isReservedByMe && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleComplete}
                disabled={isLoading || wish.completed}
                className={wish.completed ? "text-green-500" : ""}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {isMyWish && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={wish.received ? "secondary" : "default"}
              size="sm"
              className="flex-1"
              onClick={handleToggleReceived}
              disabled={isLoading}
            >
              <Gift className="h-4 w-4 mr-2" />
              {wish.received ? "Mark as Not Received" : "Mark as Received"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
