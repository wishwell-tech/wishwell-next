'use client';

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/shared/section-header";
import EmptyState from "@/components/shared/empty-state";
import EventCard, { EventWithRelations } from "@/components/shared/event-card";

function EventSkeleton() {
    return (
        <Card className="p-4">
            <Skeleton className="w-3/4 h-5 mb-2" />
            <div className="flex items-center gap-4 mb-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-32 h-4" />
        </Card>
    );
}

async function fetchEvents() {
    // TODO: Implement actual API call
    const response = await fetch('/api/events');
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

export default function UpcomingEventsSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventWithRelations[]>([]);

    // Simple error display
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
                <SectionHeader title="Upcoming Events" />
                {[1, 2, 3].map((i) => (
                    <EventSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon={Calendar}
                    title="No Upcoming Events"
                    description="You don't have any events coming up."
                    actionLabel="Create Event"
                    onAction={() => console.log('Create event')}
                />
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <SectionHeader 
                title="Upcoming Events" 
                actionLabel="View Calendar"
                onAction={() => console.log('View calendar')}
            />
            {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
} 