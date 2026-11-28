import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/templates', label: 'Templates' },
  { to: '/#categories', label: 'Categories', hash: true },
  { to: '/#how', label: 'How it works', hash: true },
  { to: '/my-sites', label: 'My Websites' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.hash ? (
              <a key={l.to} href={l.to} className="text-sm font-medium text-slate-600 hover:text-ink">{l.label}</a>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>
            )
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/templates" className="hidden rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 sm:inline-block">
            Create website
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d={open ? 'M6 18 18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          {links.map((l) =>
            l.hash ? (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{l.label}</a>
            ) : (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{l.label}</Link>
            )
          )}
          <Link to="/templates" onClick={() => setOpen(false)} className="mt-2 block rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-white">
            Create website
          </Link>
        </nav>
      )}
    </header>
  );
}
