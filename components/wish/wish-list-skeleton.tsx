export default function WishListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
} 