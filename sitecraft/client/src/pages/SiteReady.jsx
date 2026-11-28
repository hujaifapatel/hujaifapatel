import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, editKeys, API_BASE } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import PageTabs from '../components/PageTabs.jsx';
import Steps from '../components/Steps.jsx';
import MessagesInbox from '../components/MessagesInbox.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader, Spinner } from '../components/States.jsx';

export default function SiteReady() {
  const { id } = useParams();
  const { data: site, loading, error } = useFetch(() => api.site(id), [id]);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState('home');
  const [zipping, setZipping] = useState(''); // 'react' | 'html' | ''
  const editKey = editKeys.get(id);
  const [inboxKey, setInboxKey] = useState(0); // bump to reload the inbox

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Website not found" />;

  const liveUrl = `${window.location.origin}/s/${site._id}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', liveUrl);
    }
  };
  // React project (main download) or plain HTML files
  const download = async (kind) => {
    setZipping(kind);
    try {
      if (kind === 'react') {
        const { downloadReactProject } = await import('../lib/exportReact.js');
        await downloadReactProject(site.template, site.data, site._id);
      } else {
        const { downloadSite } = await import('../lib/exportHtml.jsx');
        await downloadSite(site.template, site.data, site._id);
      }
    } finally {
      setZipping('');
    }
  };

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex justify-center"><Steps current={3} /></div>
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">🎉</div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Your website is ready!</h1>
          <p className="mt-3 text-slate-500">
            <strong className="text-ink">{site.data.title}</strong> — “{site.template.name}” template · 3 pages ·{' '}
            {site.data.products.length} {site.template.content.productsLabel.toLowerCase()} · {site.data.images.length} images
            {editKey && <> · 👁 {site.views} views</>}
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
          <button onClick={() => download('react')} disabled={!!zipping} className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {zipping === 'react' ? <Spinner className="h-4 w-4 border-2 border-white/30 border-t-white" /> : <span>⚛️</span>}
            Download React project (.zip)
          </button>
          {editKey && (
            <Link to={`/customize/${site.template._id}?site=${site._id}`} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50">
              ✏️ Edit website
            </Link>
          )}
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-slate-400">
          A React + Vite + Tailwind project with your data in <code>src/data/site.json</code> and your images in <code>public/images</code>.
          Run <code>npm install</code> and <code>npm run dev</code> to open it.{' '}
          <button onClick={() => download('html')} disabled={!!zipping} className="font-semibold text-slate-500 underline hover:text-ink disabled:opacity-60">
            {zipping === 'html' ? 'Preparing…' : 'Need plain HTML files instead?'}
          </button>
        </p>

        {editKey && (
          <div className="mx-auto mt-10 max-w-3xl">
            <MessagesInbox siteId={site._id} editKey={editKey} reloadKey={inboxKey} />
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <PageTabs template={site.template} value={page} onChange={setPage} />
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          <ScaledFrame width={1280} height={680} scrollable resetKey={page}>
            <TemplateRenderer
              template={site.template}
              data={site.data}
              page={page}
              // siteId makes the contact form in this preview save real messages
              nav={{ mode: 'preview', go: setPage, siteId: site._id, apiBase: API_BASE, onMessageSent: () => setInboxKey((k) => k + 1) }}
              strict
            />
          </ScaledFrame>
        </div>
      </div>
    </main>
  );
}
