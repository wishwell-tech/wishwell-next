import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <Link href="/p/events/new">
                    <Button>Create Event</Button>
                </Link>
            </div>
            {/* Event list component will go here */}
        </div>
    );
}