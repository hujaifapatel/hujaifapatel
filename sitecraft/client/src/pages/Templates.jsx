import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import TemplateCard from '../components/TemplateCard.jsx';
import { SkeletonGrid } from '../components/States.jsx';

export default function Templates() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const [search, setSearch] = useState(q);
  useEffect(() => setSearch(q), [q]);

  const cats = useFetch(() => api.categories(), []);
  const list = useFetch(() => api.templates({ category, q }), [category, q]);
  const catName = Object.fromEntries((cats.data || []).map((c) => [c.slug, c.name]));

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Website templates</h1>
          <p className="mt-2 text-slate-500">{list.data ? `${list.data.length} templates mile` : 'Loading...'}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search.trim() });
          }}
          className="flex w-full max-w-sm overflow-hidden rounded-full border border-slate-200 bg-white focus-within:border-brand-500"
        >
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="min-w-0 flex-1 px-5 py-2.5 text-sm outline-none" />
          <button className="px-5 text-sm font-semibold text-brand-600">Search</button>
        </form>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {[{ slug: '', name: 'All', icon: '✨' }, ...(cats.data || [])].map((c) => (
          <button
            key={c.slug}
            onClick={() => update({ category: c.slug })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              category === c.slug ? 'border-ink bg-ink text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {list.loading ? (
          <SkeletonGrid />
        ) : list.error ? (
          <p className="text-red-600">{list.error.message}</p>
        ) : list.data.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            Koi template nahi mila.{' '}
            <button onClick={() => setParams({})} className="font-semibold text-brand-600">Filters clear karein</button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.data.map((t) => <TemplateCard key={t._id} template={t} categoryName={catName[t.category]} />)}
          </div>
        )}
      </div>
    </main>
  );
}
