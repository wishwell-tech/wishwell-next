import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Wishwell - Gift Giving Made Joyful",
  description: "Coordinate gift giving with friends and family for any occasion",
  keywords: [
    "gift giving",
    "wishlist",
    "gift registry",
    "gift coordination",
    "family gifts",
    "group gifts",
    "birthday gifts",
    "Christmas gifts",
    "gift organization"
  ],
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5">
                <Link href="/" className="text-xl font-bold">Wishwell</Link>
                <div className="flex items-center gap-4">
                  <Link href="/sign-in" className="hover:text-primary">Login</Link>
                  <Button variant="outline" asChild>
                    <Link href="/sign-up" className="hover:text-primary">Signup</Link>
                  </Button>
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
            {children}
            <footer className="w-full border-t py-8 mt-20">
              <div className="max-w-5xl mx-auto px-5 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Wishwell. All rights reserved.
                </p>
                <ThemeSwitcher />
              </div>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
