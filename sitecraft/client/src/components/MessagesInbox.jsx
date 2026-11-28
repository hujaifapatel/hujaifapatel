import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { Spinner } from './States.jsx';

const fmt = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

// Messages that visitors sent through the Contact page of a website (owner only)
export default function MessagesInbox({ siteId, editKey }) {
  const [state, setState] = useState({ loading: true, error: null, items: [] });

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .messages(siteId, editKey)
      .then((items) => setState({ loading: false, error: null, items }))
      .catch((error) => setState({ loading: false, error, items: [] }));
  };
  useEffect(load, [siteId, editKey]);

  const toggleRead = async (m) => {
    const updated = await api.markMessage(siteId, m._id, !m.read, editKey);
    setState((s) => ({ ...s, items: s.items.map((x) => (x._id === m._id ? updated : x)) }));
  };
  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    await api.deleteMessage(siteId, m._id, editKey);
    setState((s) => ({ ...s, items: s.items.filter((x) => x._id !== m._id) }));
  };

  const unread = state.items.filter((m) => !m.read).length;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">
            📨 Messages {unread > 0 && <span className="ml-1 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-semibold text-white">{unread} new</span>}
          </h2>
          <p className="text-sm text-slate-500">Messages sent through the Contact page of your website.</p>
        </div>
        <button onClick={load} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">↻ Refresh</button>
      </div>

      <div className="mt-5">
        {state.loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : state.error ? (
          <p className="text-sm text-red-600">{state.error.message}</p>
        ) : state.items.length === 0 ? (
          <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">No messages yet. They will appear here when visitors contact you.</p>
        ) : (
          <ul className="space-y-3">
            {state.items.map((m) => (
              <li key={m._id} className={`rounded-xl border p-4 ${m.read ? 'border-slate-200' : 'border-brand-500/40 bg-brand-50/40'}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink">
                      {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-500" />}
                      {m.name}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-4 text-sm text-slate-500">
                      {m.phone && <a href={`tel:${m.phone}`} className="hover:text-ink">📞 {m.phone}</a>}
                      {m.email && <a href={`mailto:${m.email}`} className="break-all hover:text-ink">✉️ {m.email}</a>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{fmt(m.createdAt)}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{m.message}</p>
                <div className="mt-3 flex gap-2 text-xs font-medium">
                  <button onClick={() => toggleRead(m)} className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100">{m.read ? 'Mark as unread' : 'Mark as read'}</button>
                  <button onClick={() => remove(m)} className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
