import { PublicNavbar } from "@/components/public/public-navbar";
import { PublicFooter } from "@/components/public/public-footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full mx-auto min-h-screen flex flex-col">
      <PublicNavbar />
      <div className="max-w-7xl flex flex-col gap-1 mt-12 items-center mx-auto flex-grow">
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
