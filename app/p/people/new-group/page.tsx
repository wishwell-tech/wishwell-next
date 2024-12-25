import Header from "@/components/shared/header";
import { GroupForm } from "@/components/group/group-form";

export default function Page() {
    return (
        <div className="w-full">
            <Header title="New Group" />
            <div className="max-w-2xl mx-auto p-6">
                <GroupForm />
            </div>
        </div>
    );
}