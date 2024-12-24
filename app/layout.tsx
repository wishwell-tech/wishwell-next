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
            
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
