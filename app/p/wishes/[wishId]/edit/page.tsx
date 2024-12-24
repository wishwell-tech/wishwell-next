import { getWish } from "@/app/data/wish";
import { WishForm } from "@/components/wish/wish-form";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { wishId: string } }) {
    const { wish, error } = await getWish(params.wishId);
    
    if (error || !wish) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Wish</h1>
            <WishForm wish={wish} />
        </div>
    );
}