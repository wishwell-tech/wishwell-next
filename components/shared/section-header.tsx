import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function SectionHeader({ 
    title, 
    actionLabel, 
    onAction,
    className 
}: SectionHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between mb-4", className)}>
            <h2 className="text-lg font-semibold">{title}</h2>
            {actionLabel && (
                <Button variant="ghost" size="sm" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
} 