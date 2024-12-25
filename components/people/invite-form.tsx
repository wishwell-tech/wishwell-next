"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invitePersonAction } from "@/app/actions/people";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getGroups, GroupWithRelations } from "@/app/data/group";


export function InviteForm() {
  const [groupId, setGroupId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [groups, setGroups] = useState<GroupWithRelations[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { groups } = await getGroups();
      setGroups(groups);
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await invitePersonAction(formData);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Invitation Sent",
          description: "They'll receive an email to join Wishwell!",
        });
        router.push("/p/people");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="friend@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="groupId" className="text-sm font-medium">
          Add to Group (Optional)
        </label>
        <Select name="groupId" value={groupId} onValueChange={setGroupId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groups?.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send Invitation"}
        </Button>
      </div>
    </form>
  );
} 