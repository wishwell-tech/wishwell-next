import QuickActions from '@/components/home/quick-actions';
import AssignmentSection from '@/components/home/assignment-section';
import ReservedWishesSection from '@/components/home/reserved-wishes-section';
import UpcomingEventsSection from '@/components/home/upcoming-events-section';
import Header from '@/components/shared/header';
export default function Page() {
    return (
        <div className="flex flex-col gap-6 pb-6">
            <Header title="Home" />
            <main className="px-4 flex flex-col gap-6 container max-w-[700px]">
                <QuickActions />
                <AssignmentSection />
                <ReservedWishesSection />
                <UpcomingEventsSection />
            </main>
        </div>
    );
}