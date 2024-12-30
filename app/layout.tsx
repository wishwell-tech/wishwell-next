import localFont from "next/font/local";;
import { ThemeProvider } from "next-themes";
import "./globals.css";

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
  icons: {
    icon: "/favicon.ico",
  },
};


const domineVariable = localFont({
  src: "./fonts/Domine-VariableFont_wght.ttf",
  variable: "--font-domine-variable",
  weight: "100 900",
});

const latoVariable = localFont({
  src: "./fonts/Lato-Regular.ttf",
  variable: "--font-lato-variable",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${domineVariable.variable} ${latoVariable.variable} antialiased`} suppressHydrationWarning>
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
