
import WishListClient from "@/components/wish/wish-list-client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/section-header";

export default async function ListPage() {
  return (
    <div className="container max-w-6xl py-6">
        <div className="flex items-center justify-between">
        <SectionHeader title="My Wishes" />
        <Button asChild>
          <Link href="/p/list/new-wish">
            <Plus className="w-4 h-4 mr-2" />
            New Wish
          </Link>
        </Button>
      </div>
      <WishListClient />
    </div>
  );
}
