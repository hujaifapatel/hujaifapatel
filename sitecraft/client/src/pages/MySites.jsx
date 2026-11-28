import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, editKeys } from '../lib/api.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { Spinner } from '../components/States.jsx';

// Websites created in this browser (their edit keys are stored here)
export default function MySites() {
  const [state, setState] = useState({ loading: true, sites: [], missing: [] });

  useEffect(() => {
    const ids = editKeys.ids();
    Promise.allSettled(ids.map((id) => api.site(id))).then((results) => {
      const sites = [];
      const missing = [];
      results.forEach((r, i) => (r.status === 'fulfilled' ? sites.push(r.value) : missing.push(ids[i])));
      sites.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setState({ loading: false, sites, missing });
    });
  }, []);

  const forget = (id) => {
    if (!window.confirm('Remove this website from this list? The website itself stays online, but you will no longer be able to edit it from this browser.')) return;
    editKeys.remove(id);
    setState((s) => ({ ...s, sites: s.sites.filter((x) => x._id !== id) }));
  };

  return (
    <main className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Websites</h1>
            <p className="mt-2 text-slate-500">Websites you created in this browser. Open one to edit it or read its messages.</p>
          </div>
          <Link to="/templates" className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">+ Create new website</Link>
        </div>

        {state.loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : state.sites.length === 0 ? (
          <div className="mt-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="text-4xl">🌐</div>
            <h2 className="mt-3 font-semibold">No websites yet</h2>
            <p className="mt-1 text-sm text-slate-500">Websites you create in this browser will show up here.</p>
            <Link to="/templates" className="mt-5 inline-block text-sm font-semibold text-brand-600">Browse templates →</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.sites.map((s) => (
              <div key={s._id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative bg-slate-100">
                  <ScaledFrame width={1280} aspect={0.6}>
                    <TemplateRenderer template={s.template} data={s.data} fab={false} strict />
                  </ScaledFrame>
                  {/* overlay link — the preview itself contains links, so it cannot be wrapped */}
                  <Link to={`/site/${s._id}`} aria-label={`Open ${s.data.title}`} className="absolute inset-0" />
                </div>
                <div className="p-4">
                  <h3 className="truncate font-semibold">{s.data.title}</h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {s.template.name} · {s.data.products.length} products · updated {new Date(s.updatedAt).toLocaleDateString('en-IN')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                    <Link to={`/site/${s._id}`} className="rounded-lg bg-ink px-3 py-1.5 text-white hover:bg-slate-800">Dashboard & messages</Link>
                    <Link to={`/customize/${s.template._id}?site=${s._id}`} className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Edit</Link>
                    <a href={`/s/${s._id}`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50">View ↗</a>
                    <button onClick={() => forget(s._id)} className="ml-auto rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {state.missing.length > 0 && (
          <p className="mt-6 text-center text-xs text-slate-400">{state.missing.length} saved website(s) could not be loaded.</p>
        )}
      </div>
    </main>
  );
}
