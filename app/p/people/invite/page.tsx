import Header from "@/components/shared/header";
import { InviteForm } from "@/components/people/invite-form";

export default function InvitePage() {
    return (
        <div className="container max-w-2xl">
            <Header title="Invite Someone" />
            <div className="mt-6">
                <InviteForm />
            </div>
        </div>
    );
}