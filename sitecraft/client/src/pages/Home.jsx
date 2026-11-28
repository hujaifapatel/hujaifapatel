import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import CategoryCard from '../components/CategoryCard.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { SkeletonGrid } from '../components/States.jsx';

const how = [
  { icon: '🗂️', title: 'Pick a category', desc: 'Mobile store, fashion, restaurant, gym — choose the one that fits your business.' },
  { icon: '👀', title: 'Choose a template', desc: '3-4 professional templates in every category. Compare them with a live preview.' },
  { icon: '✍️', title: 'Add your details', desc: 'Upload 3-4 images and add your title, description, products and contact details.' },
  { icon: '🚀', title: 'Your website is ready!', desc: 'A 3-page website — Home, Products and Contact. Share the live link or download it as a ZIP.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const cats = useFetch(() => api.categories(), []);
  const featured = useFetch(() => api.templates({ featured: 'true' }), []);
  const catName = Object.fromEntries((cats.data || []).map((c) => [c.slug, c.name]));
  const totalTemplates = (cats.data || []).reduce((n, c) => n + c.templateCount, 0);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/templates${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> No coding required
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
              Your business website, <span className="text-brand-500">in minutes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Professionally designed templates for every kind of business. Choose a template, add your images,
              products and details — and your website is ready.
            </p>
            <form onSubmit={onSearch} className="mt-10 flex max-w-xl overflow-hidden rounded-full bg-white p-1.5 shadow-2xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search templates — restaurant, gym, dark..."
                className="min-w-0 flex-1 bg-transparent px-5 text-ink outline-none placeholder:text-slate-400"
              />
              <button className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600">Search</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {(cats.data || []).slice(0, 5).map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="rounded-full border border-white/15 px-3 py-1 text-slate-300 hover:border-white/40 hover:text-white">
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
          </div>
          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              [cats.data?.length || '13', 'Categories'],
              [totalTemplates || '45', 'Templates'],
              ['2 min', 'Setup time'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-sm text-slate-400">{l}</dt>
                <dd className="mt-1 text-2xl font-bold sm:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Step 1</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose your category</h2>
            <p className="mt-3 text-slate-500">Templates designed specially for each category.</p>
          </div>
          <Link to="/templates" className="text-sm font-semibold text-brand-600 hover:text-brand-700">See all templates →</Link>
        </div>
        {cats.loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />)}
          </div>
        )}
        {cats.error && <p className="mt-10 text-red-600">Could not load categories: {cats.error.message}</p>}
        {[
          { group: 'shop', title: '🛍️ Shops & Stores', desc: 'Shops that sell products — show your products with images and prices.' },
          { group: 'service', title: '🧑‍💼 Services & Businesses', desc: 'Restaurants, gyms, salons, agencies and more.' },
        ].map((g) => {
          const list = (cats.data || []).filter((c) => (c.group || 'service') === g.group);
          if (!list.length) return null;
          return (
            <div key={g.group} className="mt-12">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold">{g.title}</h3>
                <span className="text-sm text-slate-500">{g.desc}</span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => <CategoryCard key={c.slug} category={c} />)}
              </div>
            </div>
          );
        })}
      </section>

      {/* FEATURED */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured templates</h2>
          <p className="mt-3 text-slate-500">Our most popular designs — click one to see a live preview.</p>
          <div className="mt-10">
            {featured.loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.data?.map((t) => <TemplateCard key={t._id} template={t} categoryName={catName[t.category]} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How does it work?</h2>
          <p className="mt-3 text-slate-500">4 easy steps and your website is live.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {how.map((h, i) => (
            <div key={h.title} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="absolute right-5 top-5 text-5xl font-extrabold text-slate-100">{i + 1}</span>
              <div className="relative text-3xl">{h.icon}</div>
              <h3 className="relative mt-4 font-semibold">{h.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-700 p-10 text-white sm:flex-row sm:items-center sm:p-14">
          <div>
            <h2 className="text-3xl font-bold">Ready to go online?</h2>
            <p className="mt-2 text-brand-50">Create your free website today.</p>
          </div>
          <Link to="/templates" className="rounded-full bg-white px-7 py-3 font-semibold text-brand-700 shadow-lg hover:bg-brand-50">
            Get started — it's free
          </Link>
        </div>
      </section>
    </main>
  );
}
