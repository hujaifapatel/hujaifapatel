import {
  Icon, SiteLink, navItems, contactList, enquireHref, ContactForm, MapEmbed,
  hexToRgba, fontStack, year, pic, WhatsAppFab,
} from './shared.jsx';

// DARK — premium dark theme, glow + glass cards
function Header({ t, d, page }) {
  const { primary, font } = t.theme;
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6">
        <SiteLink to="home" className="truncate text-xl font-bold text-white" style={{ fontFamily: fontStack(font) }}>
          {d.title}<span style={{ color: primary }}>.</span>
        </SiteLink>
        <nav className="hidden gap-8 text-sm @3xl:flex">
          {navItems(t).map((n) => (
            <SiteLink key={n.key} to={n.key} className="hover:text-white" style={page === n.key ? { color: primary } : undefined}>{n.label}</SiteLink>
          ))}
        </nav>
        <SiteLink to="contact" className="shrink-0 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: hexToRgba(primary, 0.5), color: primary }}>{t.content.cta}</SiteLink>
      </div>
      <nav className="flex justify-center gap-6 pb-4 text-sm @3xl:hidden">
        {navItems(t).map((n) => (
          <SiteLink key={n.key} to={n.key} style={page === n.key ? { color: primary } : undefined}>{n.label}</SiteLink>
        ))}
      </nav>
    </header>
  );
}

function PageTitle({ t, label, title, subtitle }) {
  const { primary, font } = t.theme;
  return (
    <section className="relative z-10 mx-auto max-w-3xl px-5 pb-12 pt-10 text-center @3xl:pt-16">
      <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: primary }}>{label}</span>
      <h1 className="mt-4 text-5xl font-bold text-white @3xl:text-6xl" style={{ fontFamily: fontStack(font) }}>{title}</h1>
      {subtitle && <p className="mt-5 text-lg text-slate-400">{subtitle}</p>}
    </section>
  );
}

function ProductCard({ t, d, p }) {
  const { primary, accent } = t.theme;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/25">
      <img src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover opacity-90 transition group-hover:opacity-100" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{p.name}</h3>
          {p.price && <span className="shrink-0 font-semibold" style={{ color: primary }}>{p.price}</span>}
        </div>
        {p.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.description}</p>}
        <a href={enquireHref(p, d)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: primary, color: accent }}>
          Enquire now <Icon name="arrow" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function Home({ t, d }) {
  const { primary, accent, font } = t.theme;
  const c = t.content;
  return (
    <>
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 text-center @3xl:pt-20">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white @3xl:text-7xl" style={{ fontFamily: fontStack(font) }}>{d.title}</h1>
        {d.tagline && <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">{d.tagline}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <SiteLink to="products" className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold" style={{ background: primary, color: accent, boxShadow: `0 0 40px ${hexToRgba(primary, 0.45)}` }}>
            Explore {c.productsLabel} <Icon name="arrow" className="h-4 w-4" />
          </SiteLink>
          <SiteLink to="contact" className="rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-white hover:bg-white/5">Contact</SiteLink>
        </div>
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-px rounded-3xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(primary, 0.6)}, transparent 60%)` }} />
          <img src={pic(d, 0)} alt={d.title} className="relative aspect-[16/8] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 @3xl:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: primary }}>Our story</span>
          <p className="mt-6 whitespace-pre-line text-xl leading-relaxed text-slate-300">{d.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={pic(d, 1)} alt="" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          <img src={pic(d, 2)} alt="" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
          {c.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: fontStack(font) }}>{c.productsLabel}</h2>
          <SiteLink to="products" className="text-sm font-semibold" style={{ color: primary }}>View all →</SiteLink>
        </div>
        <div className="mt-10 grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {d.products.slice(0, 3).map((p, i) => <ProductCard key={i} t={t} d={d} p={p} />)}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 pb-20 @3xl:grid-cols-4">
        {d.images.map((src, i) => <img key={i} src={src} alt="" className="aspect-square w-full rounded-2xl object-cover" />)}
      </section>
    </>
  );
}

function Products({ t, d }) {
  return (
    <>
      <PageTitle t={t} label="Explore" title={t.content.productsLabel} subtitle={t.content.productsIntro} />
      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-20 @2xl:grid-cols-2 @4xl:grid-cols-3">
        {d.products.map((p, i) => <ProductCard key={i} t={t} d={d} p={p} />)}
      </section>
    </>
  );
}

function Contact({ t, d }) {
  const { primary, font } = t.theme;
  return (
    <>
      <PageTitle t={t} label="Get in touch" title="Contact us" subtitle="Koi bhi sawal ho — hum yahan hain." />
      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-5 pb-16 @3xl:grid-cols-2">
        <div className="space-y-3">
          {contactList(d).map((i) => {
            const Tag = i.href ? 'a' : 'div';
            return (
              <Tag key={i.key} href={i.href} target={i.external ? '_blank' : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/25">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: hexToRgba(primary, 0.15), color: primary }}><Icon name={i.icon} /></span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-slate-500">{i.label}</div>
                  <div className="mt-1 break-words text-white">{i.value}</div>
                </div>
              </Tag>
            );
          })}
          <img src={pic(d, 3)} alt="" className="aspect-video w-full rounded-2xl object-cover" />
        </div>
        <div className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 @3xl:p-8">
          <h2 className="mb-6 text-2xl font-bold text-white" style={{ fontFamily: fontStack(font) }}>Send a message</h2>
          <ContactForm data={d} primary={primary} dark />
        </div>
      </section>
      {d.address && <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16"><MapEmbed address={d.address} className="rounded-3xl opacity-80 grayscale invert" /></div>}
    </>
  );
}

export default function DarkLayout({ template: t, data: d, page = 'home', fab = true }) {
  const Page = page === 'products' ? Products : page === 'contact' ? Contact : Home;
  const { primary, accent } = t.theme;
  return (
    <div className="@container relative min-h-full overflow-hidden text-slate-300" style={{ background: accent, fontFamily: fontStack('Inter') }}>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: hexToRgba(primary, 0.25) }} />
      <Header t={t} d={d} page={page} />
      <main><Page t={t} d={d} /></main>
      <footer className="relative z-10 border-t border-white/10 py-8 text-sm text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 @3xl:flex-row">
          <span>© {year()} {d.title}</span>
          <div className="flex gap-6">{navItems(t).map((n) => <SiteLink key={n.key} to={n.key} className="hover:text-white">{n.label}</SiteLink>)}</div>
        </div>
      </footer>
      {fab && <WhatsAppFab number={d.whatsapp} />}
    </div>
  );
}
