import Header from "@/components/shared/header";
import { GroupListClient } from "@/components/group/group-list-client";

export default async function Page() {

    return (
        <div className="w-full">
            <Header title="People" />
            <div className="max-w-4xl mx-auto p-6">
                <GroupListClient />
            </div>
        </div>
    );
}