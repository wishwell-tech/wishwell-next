import { WishForm } from "@/components/wish/wish-form";

export default function Page() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Wish</h1>
            <WishForm />
        </div>
    );
}