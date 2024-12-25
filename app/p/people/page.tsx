import Header from "@/components/shared/header";
import { GroupListClient } from "@/components/group/group-list-client";
import { getGroups } from "@/app/data/group";

export default async function Page() {
    const { groups, error } = await getGroups();

    return (
        <div className="w-full">
            <Header title="People" />
            <div className="max-w-4xl mx-auto p-6">
                <GroupListClient groups={groups} />
            </div>
        </div>
    );
}