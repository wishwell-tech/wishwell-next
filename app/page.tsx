import { PublicNavbar } from "@/components/public/public-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PublicFooter } from "@/components/public/public-footer";

export default function Home() {
  return (
    <div className="w-full">
      <PublicNavbar />
      {/* Hero Section */}
      <div className="min-h-screen">
        <section className="max-w-5xl mx-auto px-5 py-20 flex flex-col items-center text-center">
          <div className="relative">
            {/* Placeholder for decorative elements */}
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Gift Giving Made
              <span className="text-primary"> Joyful</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Coordinate gift giving with friends and family for any occasion.
              Create groups, share wishlists, and make every celebration
              special.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-5 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Create Groups</h3>
              <p className="text-muted-foreground">
                Organize gift giving for family, friends, or any group
                celebration
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Share Wishlists</h3>
              <p className="text-muted-foreground">
                Create and share your wishlist with your loved ones
              </p>
            </div>
            <div className="p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Smart Assignments</h3>
              <p className="text-muted-foreground">
                Automatically assign gift givers and keep track of everything
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-5 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to make gift giving easier?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join Wishwell today and start organizing your gift exchanges.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Free
            </Button>
          </Link>
        </section>
      </div>
      <PublicFooter />
    </div>
  );
}
