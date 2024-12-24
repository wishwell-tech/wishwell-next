import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PublicNavbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
        <Link href="/" className="text-xl font-bold">
          Wishwell
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="hover:text-primary">
            Login
          </Link>
          <Button variant="outline" asChild>
            <Link href="/sign-up" className="hover:text-primary">
              Signup
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
} 