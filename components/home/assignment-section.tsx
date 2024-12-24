'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Gift } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";
import EmptyState from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Assignment } from "@prisma/client";

type AssignmentWithRelations = Assignment & {
    event: {
        title: string;
        date: Date;
    };
    assignedTo: {
        firstName: string;
        lastName: string;
        imageUrl: string | null;
    };
};

interface AssignmentCardProps {
    assignment: AssignmentWithRelations;
    onComplete: (id: string) => void;
}

function AssignmentCard({ assignment, onComplete }: AssignmentCardProps) {
    return (
        <Card className="p-4 flex items-start gap-4">
            <Checkbox 
                checked={assignment.completed}
                onCheckedChange={() => onComplete(assignment.id)}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={assignment.assignedTo.imageUrl || undefined} />
                        <AvatarFallback>
                            {assignment.assignedTo.firstName[0]}
                            {assignment.assignedTo.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                        Gift for {assignment.assignedTo.firstName} {assignment.assignedTo.lastName}
                    </span>
                </div>
                <h3 className="font-medium mb-1 truncate">{assignment.title}</h3>
                {assignment.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {assignment.description}
                    </p>
                )}
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{assignment.event.title}</span>
                    <span>•</span>
                    <span>Due {format(new Date(assignment.event.date), 'MMM d, yyyy')}</span>
                </div>
            </div>
        </Card>
    );
}

function AssignmentSkeleton() {
    return (
        <Card className="p-4 flex items-start gap-4">
            <Skeleton className="w-4 h-4 rounded" />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="w-full h-5 mb-1" />
                <Skeleton className="w-32 h-4" />
            </div>
        </Card>
    );
}

export default function AssignmentSection() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<AssignmentWithRelations[]>([]);

    const handleComplete = async (id: string) => {
        try {
            // TODO: Implement completion logic
            console.log('Complete assignment:', id);
        } catch (err) {
            setError('Failed to update assignment');
        }
    };

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
                <SectionHeader title="Your Gift Assignments" />
                {[1, 2, 3].map((i) => (
                    <AssignmentSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon={Gift}
                    title="No Assignments"
                    description="You don't have any gift assignments yet."
                    actionLabel="Create Assignment"
                    onAction={() => console.log('Create assignment')}
                />
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <SectionHeader 
                title="Your Gift Assignments" 
                actionLabel={assignments.length > 3 ? "View All" : undefined}
                onAction={() => console.log('View all assignments')}
            />
            {assignments.slice(0, 3).map((assignment) => (
                <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onComplete={handleComplete}
                />
            ))}
        </div>
    );
} 