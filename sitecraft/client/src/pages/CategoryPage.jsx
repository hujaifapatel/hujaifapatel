import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import TemplateCard from '../components/TemplateCard.jsx';
import Steps from '../components/Steps.jsx';
import { ErrorState, SkeletonGrid } from '../components/States.jsx';

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = useFetch(() => api.category(slug), [slug]);
  const list = useFetch(() => api.templates({ category: slug }), [slug]);

  if (cat.error) return <ErrorState error={cat.error} title="Category nahi mili" />;

  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-white">
        {cat.data?.cover && <img src={cat.data.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Link to="/#categories" className="text-sm text-slate-400 hover:text-white">← All categories</Link>
          <div className="mt-4 text-5xl">{cat.data?.icon}</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{cat.data?.name || '...'}</h1>
          <p className="mt-3 max-w-xl text-slate-300">{cat.data?.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Ek template select karein</h2>
          <Steps current={1} />
        </div>
        {list.loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.data?.map((t) => <TemplateCard key={t._id} template={t} categoryName={cat.data?.name} />)}
          </div>
        )}
      </section>
    </main>
  );
}
