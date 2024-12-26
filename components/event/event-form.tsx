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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createEventAction } from "@/app/actions/event";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Event, Group } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGroups } from "@/app/data/group";

interface EventFormProps {
  event?: Event;
}

export function EventForm({  event }: EventFormProps) {

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { groups } = await getGroups();
      setGroups(groups);
      console.log(groups);
    };
    fetchGroups();
  }, []);

  const [date, setDate] = useState<Date | undefined>(
    event?.date ? new Date(event.date) : undefined
  );
  const [selectedGroup, setSelectedGroup] = useState<string>(
    event?.groupId || ""
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (formData: FormData) => {
    if (!date) return;

    // Set the time to noon to avoid timezone issues
    const datetime = new Date(date);
    datetime.setHours(12, 0, 0, 0);

    // Update the date in the form data
    formData.set("date", datetime.toISOString());

    startTransition(async () => {
      await createEventAction(formData);
      router.push("/p/events");
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          name="title"
          placeholder="Event name"
          required
          defaultValue={event?.title || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add details about the event..."
          rows={4}
          defaultValue={event?.description || ""}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date *</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {groups && groups.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="groupId" className="text-sm font-medium">
            Group (Optional)
          </label>
          <Select
            name="groupId"
            value={selectedGroup}
            onValueChange={setSelectedGroup}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No group</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
        <Button type="submit" className="flex-1" disabled={isPending || !date}>
          {isPending ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
