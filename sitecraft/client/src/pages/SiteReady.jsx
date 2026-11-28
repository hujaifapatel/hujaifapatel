import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import Steps from '../components/Steps.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader } from '../components/States.jsx';

export default function SiteReady() {
  const { id } = useParams();
  const { data: site, loading, error } = useFetch(() => api.site(id), [id]);
  const [copied, setCopied] = useState(false);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Website nahi mili" />;

  const liveUrl = `${window.location.origin}/s/${site._id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Link copy karein:', liveUrl);
    }
  };

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex justify-center"><Steps current={3} /></div>
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">🎉</div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Aapki website ready hai!</h1>
          <p className="mt-3 text-slate-500">
            <strong className="text-ink">{site.data.title}</strong> — “{site.template.name}” template ke saath.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-600">{liveUrl}</code>
          <button onClick={copy} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
            {copied ? '✓ Copied' : 'Copy link'}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href={`/s/${site._id}`} target="_blank" rel="noreferrer" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600">
            Open live website ↗
          </a>
          <button onClick={async () => (await import('../lib/exportHtml.jsx')).downloadHtml(site.template, site.data)} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            ⬇ Download HTML
          </button>
          <Link to={`/customize/${site.template._id}`} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50">
            Edit details
          </Link>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <ScaledFrame width={1280} height={640} scrollable>
            <TemplateRenderer template={site.template} data={site.data} strict />
          </ScaledFrame>
        </div>
      </div>
    </main>
  );
}
