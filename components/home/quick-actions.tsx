'use client';

import { Gift, Calendar, Users, Handshake } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

const actions = [
    { icon: Gift, label: 'Wish', action: () => console.log('Add Wish') },
    { icon: Calendar, label: 'Event', action: () => console.log('Create Event') },
    { icon: Users, label: 'Group', action: () => console.log('Create Group') },
    { icon: Handshake, label: 'Asgnmnt', action: () => console.log('Make Assignment') },
];

export default function QuickActions() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
                Quick Actions
            </h3>
            <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide"
            >
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        onClick={action.action}
                        variant="secondary"
                        className="flex items-center gap-2 h-12 px-4"
                    >
                        <action.icon className="w-4 h-4" />
                        <span className="text-sm whitespace-nowrap">
                            {action.label}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
} 