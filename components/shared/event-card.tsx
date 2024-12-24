'use client';

import { Event } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Users } from "lucide-react";

type EventWithRelations = Event & {
    group?: {
        id: string;
        name: string;
        imageUrl: string | null;
    };
    assignmentCount: number;
};

interface EventCardProps {
    event: EventWithRelations;
    className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
    if (!event) return null;

    const eventDate = event.date ? new Date(event.date) : null;
    const isValidDate = eventDate && !isNaN(eventDate.getTime());
    
    return (
        <Card className={className}>
            <div className="p-4">
                <h3 className="font-medium mb-1">{event.title || 'Untitled Event'}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {isValidDate 
                                ? format(eventDate, 'MMM d, yyyy')
                                : 'Date not set'
                            }
                        </span>
                    </div>
                    {event.group && (
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{event.group.name}</span>
                        </div>
                    )}
                </div>
                {typeof event.assignmentCount === 'number' && event.assignmentCount > 0 && (
                    <p className="text-sm">
                        {event.assignmentCount} gift{event.assignmentCount !== 1 ? 's' : ''} to give
                    </p>
                )}
            </div>
        </Card>
    );
}

export type { EventWithRelations }; 