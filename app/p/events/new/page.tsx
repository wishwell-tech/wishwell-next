import { getGroups } from "@/app/data/group";
import { EventForm } from "@/components/event/event-form";

export default async function NewEventPage() {
    const groups = await getGroups();
    
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
            <EventForm />
        </div>
    );
} 