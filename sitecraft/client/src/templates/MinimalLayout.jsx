import {
  SiteLink, navItems, contactList, enquireHref, ContactForm, MapEmbed,
  hexToRgba, fontStack, year, pic, WhatsAppFab,
} from './shared.jsx';

// MINIMAL — spacious, centered, serif headings, hairline dividers
function Header({ t, d, page }) {
  const { accent } = t.theme;
  return (
    <header className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-8 @3xl:flex-row @3xl:justify-between">
      <SiteLink to="home" className="text-lg uppercase tracking-[0.25em]" style={{ color: accent }}>{d.title}</SiteLink>
      <nav className="flex gap-8 text-sm text-stone-500">
        {navItems(t).map((n) => (
          <SiteLink key={n.key} to={n.key} className="hover:text-stone-900" style={page === n.key ? { color: accent, textDecoration: 'underline', textUnderlineOffset: 6 } : undefined}>{n.label}</SiteLink>
        ))}
      </nav>
    </header>
  );
}

function PageTitle({ t, title, subtitle }) {
  const { accent, primary, font } = t.theme;
  return (
    <section className="mx-auto max-w-3xl px-5 pb-12 pt-10 text-center @3xl:pt-16">
      <h1 className="text-5xl @3xl:text-6xl" style={{ color: accent, fontFamily: fontStack(font) }}>{title}</h1>
      <div className="mx-auto my-6 h-px w-16" style={{ background: primary }} />
      {subtitle && <p className="text-lg text-stone-500">{subtitle}</p>}
    </section>
  );
}

function ProductRow({ t, d, p, i }) {
  const { primary, accent, font } = t.theme;
  return (
    <div className="grid items-center gap-8 py-10 @2xl:grid-cols-2">
      <img src={p.image} alt={p.name} className={`aspect-[4/3] w-full object-cover ${i % 2 ? '@2xl:order-2' : ''}`} />
      <div>
        <span className="text-sm text-stone-400">0{i + 1}</span>
        <h3 className="mt-2 text-3xl" style={{ color: accent, fontFamily: fontStack(font) }}>{p.name}</h3>
        {p.price && <div className="mt-2 text-lg" style={{ color: primary }}>{p.price}</div>}
        {p.description && <p className="mt-4 leading-relaxed text-stone-500">{p.description}</p>}
        <a href={enquireHref(p, d)} target="_blank" rel="noreferrer" className="mt-6 inline-block border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary, borderColor: primary }}>Enquire</a>
      </div>
    </div>
  );
}

function Home({ t, d }) {
  const { primary, accent, font } = t.theme;
  const c = t.content;
  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pt-10 text-center @3xl:pt-16">
        <h1 className="text-5xl leading-tight @3xl:text-7xl" style={{ color: accent, fontFamily: fontStack(font) }}>{d.title}</h1>
        {d.tagline && <p className="mx-auto mt-6 max-w-lg text-lg text-stone-500">{d.tagline}</p>}
        <SiteLink to="products" className="mt-10 inline-block border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary, borderColor: primary }}>
          Explore {c.productsLabel}
        </SiteLink>
        <img src={pic(d, 0)} alt={d.title} className="mt-16 aspect-[16/9] w-full object-cover" />
      </section>

      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mx-auto mb-8 h-px w-16" style={{ background: primary }} />
        <p className="whitespace-pre-line text-2xl leading-relaxed @3xl:text-3xl" style={{ color: accent, fontFamily: fontStack(font) }}>{d.description}</p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="grid gap-10 text-center @2xl:grid-cols-4">
          {c.features.map((f) => (
            <div key={f.title}>
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 text-lg" style={{ color: accent, fontFamily: fontStack(font) }}>{f.title}</h3>
              <p className="mt-2 text-sm text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">{c.productsLabel}</h2>
        <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          {d.products.slice(0, 2).map((p, i) => <ProductRow key={i} t={t} d={d} p={p} i={i} />)}
        </div>
        <div className="mt-10 text-center">
          <SiteLink to="products" className="text-sm uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900">View all {c.productsLabel} →</SiteLink>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-3 gap-3 px-5 pb-24">
        {d.images.slice(1).map((src, i) => <img key={i} src={src} alt="" className="aspect-[3/4] w-full object-cover" />)}
      </section>
    </>
  );
}

function Products({ t, d }) {
  return (
    <>
      <PageTitle t={t} title={t.content.productsLabel} subtitle={t.content.productsIntro} />
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {d.products.map((p, i) => <ProductRow key={i} t={t} d={d} p={p} i={i} />)}
        </div>
      </section>
    </>
  );
}

function Contact({ t, d }) {
  const { primary, accent } = t.theme;
  return (
    <>
      <PageTitle t={t} title="Say hello" subtitle="We would love to hear from you." />
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <img src={pic(d, 3)} alt="" className="aspect-[21/9] w-full object-cover" />
        <div className="mt-16 grid gap-16 @3xl:grid-cols-2">
          <div className="space-y-8">
            {contactList(d).map((i) => {
              const Tag = i.href ? 'a' : 'div';
              return (
                <Tag key={i.key} href={i.href} target={i.external ? '_blank' : undefined} rel="noreferrer" className="group block min-w-0">
                  <div className="text-xs uppercase tracking-[0.25em] text-stone-400">{i.label}</div>
                  <div className="mt-2 break-words text-xl group-hover:underline" style={{ color: accent }}>{i.value}</div>
                </Tag>
              );
            })}
          </div>
          <ContactForm data={d} primary={primary} square />
        </div>
      </section>
      <div className="px-5 pb-16" style={{ background: hexToRgba(primary, 0.04) }}>
        <div className="mx-auto max-w-5xl"><MapEmbed address={d.address} /></div>
      </div>
    </>
  );
}

export default function MinimalLayout({ template: t, data: d, page = 'home', fab = true }) {
  const Page = page === 'products' ? Products : page === 'contact' ? Contact : Home;
  return (
    <div className="@container min-h-full bg-[#fbfaf8] text-stone-700" style={{ fontFamily: fontStack('Inter') }}>
      <Header t={t} d={d} page={page} />
      <main><Page t={t} d={d} /></main>
      <footer className="border-t border-stone-200 py-10 text-center text-xs uppercase tracking-[0.2em] text-stone-400">
        <div className="mb-4 flex justify-center gap-8">{navItems(t).map((n) => <SiteLink key={n.key} to={n.key} className="hover:text-stone-900">{n.label}</SiteLink>)}</div>
        © {year()} {d.title}
      </footer>
      {fab && <WhatsAppFab number={d.whatsapp} />}
    </div>
  );
}
