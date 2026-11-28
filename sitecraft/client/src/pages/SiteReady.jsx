import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, editKeys } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import PageTabs from '../components/PageTabs.jsx';
import Steps from '../components/Steps.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader, Spinner } from '../components/States.jsx';

export default function SiteReady() {
  const { id } = useParams();
  const { data: site, loading, error } = useFetch(() => api.site(id), [id]);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState('home');
  const [zipping, setZipping] = useState(false);
  const canEdit = Boolean(editKeys.get(id));

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
  const download = async () => {
    setZipping(true);
    try {
      const { downloadSite } = await import('../lib/exportHtml.jsx');
      await downloadSite(site.template, site.data);
    } finally {
      setZipping(false);
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
            <strong className="text-ink">{site.data.title}</strong> — “{site.template.name}” template · 3 pages ·{' '}
            {site.data.products.length} {site.template.content.productsLabel.toLowerCase()} · {site.data.images.length} images
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
          <button onClick={download} disabled={zipping} className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {zipping && <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" />}
            ⬇ Download website (.zip)
          </button>
          {canEdit && (
            <Link to={`/customize/${site.template._id}?site=${site._id}`} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50">
              ✏️ Edit details
            </Link>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">ZIP me index.html, products.html, contact.html aur images folder hai — kisi bhi hosting par upload kar sakte hain.</p>

        <div className="mt-12 flex justify-center">
          <PageTabs template={site.template} value={page} onChange={setPage} />
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <ScaledFrame width={1280} height={680} scrollable resetKey={page}>
            <TemplateRenderer template={site.template} data={site.data} page={page} nav={{ mode: 'preview', go: setPage }} strict />
          </ScaledFrame>
        </div>
      </div>
    </main>
  );
}
