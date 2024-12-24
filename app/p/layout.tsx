import { MainNav } from '@/components/layout/main-nav';
import Header from '@/components/shared/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
    children: React.ReactNode;
    params: { title?: string };
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="bg-background">
            <SidebarProvider>
                <MainNav />
                <SidebarInset>
                <div> {/* Offset content for sidebar on tablet/desktop */}
                    <div>
                        {children}
                    </div>
                </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}