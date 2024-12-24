'use client';

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
    error: Error;
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    return (
        <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                    <h3 className="font-medium mb-1">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {error.message || 'An error occurred while loading this section'}
                    </p>
                    <Button onClick={reset} variant="outline">
                        Try again
                    </Button>
                </div>
            </div>
        </Card>
    );
} 