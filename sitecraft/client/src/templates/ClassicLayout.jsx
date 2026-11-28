import {
  Icon, SiteLink, navItems, contactList, enquireHref, ContactForm, MapEmbed,
  hexToRgba, fontStack, year, pic, WhatsAppFab,
} from './shared.jsx';

// CLASSIC — light theme, rounded cards, split hero
function Header({ t, d, page }) {
  const { primary, accent, font } = t.theme;
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <SiteLink to="home" className="truncate text-xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>{d.title}</SiteLink>
        <nav className="hidden items-center gap-8 text-sm font-medium @3xl:flex">
          {navItems(t).map((n) => (
            <SiteLink key={n.key} to={n.key} className="transition hover:opacity-70" style={page === n.key ? { color: primary } : undefined}>{n.label}</SiteLink>
          ))}
        </nav>
        <SiteLink to="contact" className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ background: primary }}>{t.content.cta}</SiteLink>
      </div>
      <nav className="flex justify-center gap-6 border-t border-slate-100 py-2.5 text-sm font-medium @3xl:hidden">
        {navItems(t).map((n) => (
          <SiteLink key={n.key} to={n.key} style={page === n.key ? { color: primary } : undefined}>{n.label}</SiteLink>
        ))}
      </nav>
    </header>
  );
}

function PageBanner({ t, d, title, subtitle, image }) {
  const { accent, font } = t.theme;
  return (
    <section className="relative overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: hexToRgba(accent, 0.7) }} />
      <div className="relative mx-auto max-w-6xl px-5 py-20 text-center text-white @3xl:py-28">
        <h1 className="text-4xl font-bold @3xl:text-5xl" style={{ fontFamily: fontStack(font) }}>{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-white/85">{subtitle}</p>}
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/60">{d.title}</p>
      </div>
    </section>
  );
}

function ProductCard({ t, d, p }) {
  const { primary, accent } = t.theme;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
      <img src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold" style={{ color: accent }}>{p.name}</h3>
          {p.price && <span className="shrink-0 rounded-full px-3 py-1 text-sm font-bold" style={{ background: hexToRgba(primary, 0.1), color: primary }}>{p.price}</span>}
        </div>
        {p.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{p.description}</p>}
        <a href={enquireHref(p, d)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-80" style={{ borderColor: primary, color: primary }}>
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
      <section style={{ background: `linear-gradient(180deg, ${hexToRgba(primary, 0.08)}, #fff)` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 @3xl:grid-cols-2 @3xl:py-24">
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ background: hexToRgba(primary, 0.12), color: primary }}>Welcome</span>
            <h1 className="mt-5 text-4xl font-bold leading-tight @3xl:text-6xl" style={{ color: accent, fontFamily: fontStack(font) }}>{d.title}</h1>
            {d.tagline && <p className="mt-5 max-w-md text-lg text-slate-500">{d.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <SiteLink to="products" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white" style={{ background: primary, boxShadow: `0 10px 25px ${hexToRgba(primary, 0.35)}` }}>
                View {c.productsLabel} <Icon name="arrow" className="h-4 w-4" />
              </SiteLink>
              <SiteLink to="contact" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">Contact us</SiteLink>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem]" style={{ background: hexToRgba(primary, 0.15) }} />
            <img src={pic(d, 0)} alt={d.title} className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 @3xl:grid-cols-2">
        <img src={pic(d, 1)} alt="" className="aspect-square w-full rounded-3xl object-cover @3xl:order-none" />
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>About us</h2>
          <p className="mt-4 text-3xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>{d.tagline || d.title}</p>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-600">{d.description}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {c.features.slice(0, 4).map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg" style={{ background: hexToRgba(primary, 0.1) }}>{f.icon}</span>
                <span className="text-sm font-semibold" style={{ color: accent }}>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold @3xl:text-4xl" style={{ color: accent, fontFamily: fontStack(font) }}>Our {c.productsLabel}</h2>
              <p className="mt-2 text-slate-500">{c.productsIntro}</p>
            </div>
            <SiteLink to="products" className="text-sm font-semibold" style={{ color: primary }}>View all →</SiteLink>
          </div>
          <div className="mt-10 grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
            {d.products.slice(0, 3).map((p, i) => <ProductCard key={i} t={t} d={d} p={p} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>Gallery</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 @3xl:grid-cols-4">
          {d.images.map((src, i) => (
            <img key={i} src={src} alt="" className={`h-full w-full rounded-2xl object-cover ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl p-10 text-white @3xl:flex-row @3xl:items-center" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: fontStack(font) }}>Ready to get started?</h2>
            <p className="mt-2 text-white/80">Get in touch with us today.</p>
          </div>
          <SiteLink to="contact" className="rounded-full bg-white px-7 py-3 font-semibold" style={{ color: accent }}>{c.cta}</SiteLink>
        </div>
      </section>
    </>
  );
}

function Products({ t, d }) {
  return (
    <>
      <PageBanner t={t} d={d} title={`Our ${t.content.productsLabel}`} subtitle={t.content.productsIntro} image={pic(d, 2)} />
      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {d.products.map((p, i) => <ProductCard key={i} t={t} d={d} p={p} />)}
        </div>
      </section>
    </>
  );
}

function Contact({ t, d }) {
  const { primary, accent, font } = t.theme;
  return (
    <>
      <PageBanner t={t} d={d} title="Contact us" subtitle="Have a question or want to make a booking? We are just a call away." image={pic(d, 3)} />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 @3xl:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>Get in touch</h2>
          <div className="mt-6 space-y-3">
            {contactList(d).map((i) => {
              const Tag = i.href ? 'a' : 'div';
              return (
                <Tag key={i.key} href={i.href} target={i.external ? '_blank' : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: primary }}><Icon name={i.icon} /></span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-slate-400">{i.label}</div>
                    <div className="mt-0.5 break-words font-medium" style={{ color: accent }}>{i.value}</div>
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 @3xl:p-8">
          <h2 className="text-2xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>Send a message</h2>
          <p className="mb-6 mt-1 text-sm text-slate-500">We will get back to you as soon as possible.</p>
          <ContactForm data={d} primary={primary} />
        </div>
      </section>
      {d.address && <div className="mx-auto max-w-6xl px-5 pb-16"><MapEmbed address={d.address} className="rounded-3xl" /></div>}
    </>
  );
}

export default function ClassicLayout({ template: t, data: d, page = 'home', fab = true }) {
  const Page = page === 'products' ? Products : page === 'contact' ? Contact : Home;
  return (
    <div className="@container min-h-full bg-white text-slate-700" style={{ fontFamily: fontStack('Inter') }}>
      <Header t={t} d={d} page={page} />
      <main><Page t={t} d={d} /></main>
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-slate-400 @3xl:flex-row">
          <span>© {year()} {d.title}. All rights reserved.</span>
          <div className="flex gap-6">{navItems(t).map((n) => <SiteLink key={n.key} to={n.key} className="hover:text-slate-700">{n.label}</SiteLink>)}</div>
        </div>
      </footer>
      {fab && <WhatsAppFab number={d.whatsapp} />}
    </div>
  );
}
