'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <button 
        onClick={reset}
        className="text-sm text-blue-500 hover:text-blue-600"
      >
        Try again
      </button>
    </div>
  );
} 