import {
  Icon, SiteLink, navItems, contactList, enquireHref, ContactForm, MapEmbed,
  hexToRgba, fontStack, year, pic, WhatsAppFab,
} from './shared.jsx';

// BOLD — full-bleed image heroes, uppercase type, sharp edges
function Nav({ t, page }) {
  const { primary } = t.theme;
  return navItems(t).map((n) => (
    <SiteLink key={n.key} to={n.key} className="border-b-2 pb-1" style={{ borderColor: page === n.key ? primary : 'transparent' }}>
      {n.label}
    </SiteLink>
  ));
}

function Hero({ t, d, page, image, title, subtitle, big = false, children }) {
  const { accent, primary, font } = t.theme;
  return (
    <section className={`relative flex flex-col overflow-hidden text-white ${big ? 'min-h-[640px]' : 'min-h-[380px]'}`}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, ${hexToRgba(accent, 0.92)} 25%, ${hexToRgba(accent, 0.35)})` }} />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6">
        <SiteLink to="home" className="truncate text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: fontStack(font) }}>{d.title}</SiteLink>
        <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-wider @3xl:flex"><Nav t={t} page={page} /></nav>
      </header>
      <nav className="relative z-10 flex justify-center gap-6 px-5 text-xs font-semibold uppercase tracking-wider @3xl:hidden"><Nav t={t} page={page} /></nav>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16">
        <div className="mb-6 h-1.5 w-20" style={{ background: primary }} />
        <h1 className={`max-w-3xl font-bold uppercase leading-[0.95] ${big ? 'text-5xl @3xl:text-7xl @5xl:text-8xl' : 'text-4xl @3xl:text-6xl'}`} style={{ fontFamily: fontStack(font) }}>{title}</h1>
        {subtitle && <p className="mt-6 max-w-xl text-xl text-white/85">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

function ProductCard({ t, d, p, i }) {
  const { primary, accent, font } = t.theme;
  return (
    <div className="group flex flex-col bg-white ring-1 ring-slate-200">
      <div className="relative overflow-hidden">
        <img src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-0 top-0 px-3 py-1 text-sm font-bold text-white" style={{ background: accent, fontFamily: fontStack(font) }}>0{i + 1}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold uppercase" style={{ color: accent, fontFamily: fontStack(font) }}>{p.name}</h3>
        {p.price && <div className="mt-1 text-lg font-bold" style={{ color: primary }}>{p.price}</div>}
        {p.description && <p className="mt-3 flex-1 text-slate-500">{p.description}</p>}
        <a href={enquireHref(p, d)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white" style={{ background: primary }}>
          Enquire <Icon name="arrow" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function Home({ t, d, page }) {
  const { primary, accent, font } = t.theme;
  const c = t.content;
  return (
    <>
      <Hero t={t} d={d} page={page} image={pic(d, 0)} title={d.title} subtitle={d.tagline} big>
        <div className="mt-10 flex flex-wrap gap-4">
          <SiteLink to="products" className="inline-flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider text-white" style={{ background: primary }}>
            {c.productsLabel} <Icon name="arrow" className="h-5 w-5" />
          </SiteLink>
          <SiteLink to="contact" className="border-2 border-white px-8 py-4 font-bold uppercase tracking-wider">{c.cta}</SiteLink>
        </div>
      </Hero>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 @3xl:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold uppercase @3xl:text-5xl" style={{ color: accent, fontFamily: fontStack(font) }}>
              Who<br />we are<span style={{ color: primary }}>.</span>
            </h2>
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-slate-600">{d.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={pic(d, 1)} alt="" className="aspect-[3/4] w-full object-cover" />
            <img src={pic(d, 2)} alt="" className="mt-10 aspect-[3/4] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: accent }}>
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-bold uppercase text-white" style={{ fontFamily: fontStack(font) }}>Why us<span style={{ color: primary }}>?</span></h2>
          <div className="mt-12 grid gap-px bg-white/10 @xl:grid-cols-2 @4xl:grid-cols-4">
            {c.features.map((f, i) => (
              <div key={f.title} className="p-8" style={{ background: accent }}>
                <div className="text-5xl font-bold" style={{ color: primary, fontFamily: fontStack(font) }}>0{i + 1}</div>
                <h3 className="mt-6 text-xl font-bold text-white">{f.icon} {f.title}</h3>
                <p className="mt-3 text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-4xl font-bold uppercase" style={{ color: accent, fontFamily: fontStack(font) }}>{c.productsLabel}</h2>
            <SiteLink to="products" className="font-bold uppercase tracking-wider" style={{ color: primary }}>View all →</SiteLink>
          </div>
          <div className="mt-10 grid gap-6 @2xl:grid-cols-2 @4xl:grid-cols-3">
            {d.products.slice(0, 3).map((p, i) => <ProductCard key={i} t={t} d={d} p={p} i={i} />)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 @3xl:grid-cols-4">
        {d.images.map((src, i) => <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />)}
      </section>
    </>
  );
}

function Products({ t, d, page }) {
  return (
    <>
      <Hero t={t} d={d} page={page} image={pic(d, 1)} title={t.content.productsLabel} subtitle={t.content.productsIntro} />
      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {d.products.map((p, i) => <ProductCard key={i} t={t} d={d} p={p} i={i} />)}
        </div>
      </section>
    </>
  );
}

function Contact({ t, d, page }) {
  const { primary, accent, font } = t.theme;
  return (
    <>
      <Hero t={t} d={d} page={page} image={pic(d, 3)} title="Let's talk" subtitle="Contact us today and take the first step." />
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 @3xl:grid-cols-2">
          <div className="space-y-4">
            {contactList(d).map((i) => {
              const Tag = i.href ? 'a' : 'div';
              return (
                <Tag key={i.key} href={i.href} target={i.external ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-5 border-l-4 bg-slate-50 p-5" style={{ borderColor: primary }}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center text-white" style={{ background: primary }}><Icon name={i.icon} /></span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{i.label}</div>
                    <div className="break-words text-lg font-semibold" style={{ color: accent }}>{i.value}</div>
                  </div>
                </Tag>
              );
            })}
          </div>
          <div className="p-8 text-white" style={{ background: accent }}>
            <h2 className="mb-6 text-3xl font-bold uppercase" style={{ fontFamily: fontStack(font) }}>Send a message<span style={{ color: primary }}>.</span></h2>
            <ContactForm data={d} primary={primary} dark square />
          </div>
        </div>
      </section>
      <MapEmbed address={d.address} />
    </>
  );
}

export default function BoldLayout({ template: t, data: d, page = 'home', fab = true }) {
  const Page = page === 'products' ? Products : page === 'contact' ? Contact : Home;
  const { accent } = t.theme;
  return (
    <div className="@container min-h-full bg-white text-slate-800" style={{ fontFamily: fontStack('Inter') }}>
      <main><Page t={t} d={d} page={page} /></main>
      <footer className="py-8 text-sm text-white/60" style={{ background: accent }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 @3xl:flex-row">
          <span>© {year()} {d.title}</span>
          <div className="flex gap-6 uppercase tracking-wider">{navItems(t).map((n) => <SiteLink key={n.key} to={n.key} className="hover:text-white">{n.label}</SiteLink>)}</div>
        </div>
      </footer>
      {fab && <WhatsAppFab number={d.whatsapp} />}
    </div>
  );
}
