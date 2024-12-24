"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWishAction, updateWishAction } from "@/app/actions/wish";
import { useState, useTransition } from "react";
import type { Wish } from "@prisma/client";
import { useRouter } from "next/navigation";

interface WishFormProps {
  wish?: Wish;
}

export function WishForm({ wish }: WishFormProps) {
  const [priority, setPriority] = useState<string>(wish?.priority?.toString() || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEditing = Boolean(wish);

  const handleCancel = () => {
    router.back();
  };

  return (
    <form 
      action={(formData) => {
        startTransition(() => {
          if (isEditing && wish) {
            updateWishAction(wish.id, formData);
          } else {
            createWishAction(formData);
          }
        });
      }} 
      className="space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          name="title"
          placeholder="What do you wish for?"
          required
          defaultValue={wish?.title || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add any details about your wish..."
          rows={4}
          defaultValue={wish?.description || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          defaultValue={wish?.price?.toString() || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          Link
        </label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://..."
          defaultValue={wish?.url || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium">
          Priority
        </label>
        <Select name="priority" value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">High</SelectItem>
            <SelectItem value="2">Medium</SelectItem>
            <SelectItem value="3">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isPending}
        >
          {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Wish" : "Create Wish")}
        </Button>
      </div>
    </form>
  );
} 