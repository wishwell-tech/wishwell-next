import { ThemeSwitcher } from "@/components/theme-switcher";

export function PublicFooter() {
  return (
    <footer className="w-full border-t py-8">
      <div className="max-w-5xl mx-auto px-5 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wishwell. All rights reserved.
        </p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
} 