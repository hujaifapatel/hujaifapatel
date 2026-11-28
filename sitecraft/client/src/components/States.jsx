import { Link } from 'react-router-dom';

export function Spinner({ className = '' }) {
  return <div className={`h-8 w-8 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-500 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function ErrorState({ error, title = 'Something went wrong' }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl">😕</div>
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{error?.message || 'Please try again in a little while.'}</p>
      <Link to="/" className="mt-6 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600">
        Go to home page
      </Link>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200">
          <div className="aspect-[16/11] bg-slate-100" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-1/2 rounded bg-slate-100" />
            <div className="h-3 w-3/4 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
