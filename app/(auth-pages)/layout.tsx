import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
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
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      <div className="max-w-7xl flex flex-col gap-12 items-start">
        {children}
      </div>
      <footer className="w-full border-t py-8 mt-20">
        <div className="max-w-5xl mx-auto px-5 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wishwell. All rights reserved.
          </p>
          <ThemeSwitcher />
        </div>
      </footer>
    </div>
  );
}
