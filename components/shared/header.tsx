'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'Wishwell' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-background transition-shadow ${
            isScrolled ? 'shadow-md' : ''
        }`}>
            <div className="flex items-center justify-between container px-4 h-16">
                <h1 className="font-semibold text-xl">
                    {title}
                </h1>
                
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center"
                        >
                            2
                        </Badge>
                    </Button>
                    
                    <Link href="/settings">
                        <Avatar>
                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </header>
    );
} 