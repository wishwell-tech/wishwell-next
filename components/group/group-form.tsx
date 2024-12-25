'use client';

import { createGroup } from "@/app/actions/group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function GroupForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        
        try {
            const result = await createGroup({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                imageUrl: formData.get('imageUrl') as string,
            });
            
            // The action will handle the redirect
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create group",
                variant: "destructive",
            });
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Group Name *
                </label>
                <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Enter group name"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                </label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your group"
                    rows={3}
                />
            </div>

            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                    Image URL
                </label>
                <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Group"}
            </Button>
        </form>
    );
} 