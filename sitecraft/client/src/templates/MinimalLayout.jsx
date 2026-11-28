import { contactList, fontStack, year, WhatsAppFab, hexToRgba } from './shared.jsx';

// Spacious, centered, serif heading, large image
export default function MinimalLayout({ template, data, fab = true }) {
  const { primary, accent, font } = template.theme;
  const c = template.content;
  const contacts = contactList(data);

  return (
    <div className="@container bg-[#fbfaf8] text-stone-700" style={{ fontFamily: fontStack('Inter') }}>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-8">
        <span className="text-lg tracking-[0.25em] uppercase" style={{ color: accent }}>{data.title}</span>
        <nav className="hidden gap-8 text-sm text-stone-500 @3xl:flex">
          <a href="#about" className="hover:text-stone-900">About</a>
          <a href="#services" className="hover:text-stone-900">{c.servicesTitle}</a>
          <a href="#contact" className="hover:text-stone-900">Contact</a>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-10 text-center @3xl:pt-16">
        <h1 className="text-5xl leading-tight @3xl:text-7xl" style={{ color: accent, fontFamily: fontStack(font) }}>{data.title}</h1>
        {data.tagline && <p className="mx-auto mt-6 max-w-lg text-lg text-stone-500">{data.tagline}</p>}
        <a href="#contact" className="mt-10 inline-block border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary, borderColor: primary }}>
          {c.cta}
        </a>
        <img src={data.image} alt={data.title} className="mt-16 aspect-[16/9] w-full object-cover" />
      </section>

      <section id="about" className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mx-auto mb-8 h-px w-16" style={{ background: primary }} />
        <p className="text-2xl leading-relaxed @3xl:text-3xl" style={{ color: accent, fontFamily: fontStack(font) }}>{c.about}</p>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-5 pb-24">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">{c.servicesTitle}</h2>
        <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
          {c.services.map((s, i) => (
            <div key={s.title} className="grid gap-2 py-8 @2xl:grid-cols-[80px_1fr_1.5fr] @2xl:items-baseline">
              <span className="text-sm text-stone-400">0{i + 1}</span>
              <h3 className="text-2xl" style={{ color: accent, fontFamily: fontStack(font) }}>{s.title}</h3>
              <p className="text-stone-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-24 text-center" style={{ background: hexToRgba(primary, 0.06) }}>
        <h2 className="text-4xl @3xl:text-5xl" style={{ color: accent, fontFamily: fontStack(font) }}>Say hello</h2>
        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center justify-center gap-10 px-5 @3xl:flex-row @3xl:gap-16">
          {contacts.map((i) => (
            <a key={i.key} href={i.href} target={i.key === 'pin' ? '_blank' : undefined} rel="noreferrer" className="group min-w-0">
              <div className="text-xs uppercase tracking-[0.25em] text-stone-400">{i.label}</div>
              <div className="mt-2 break-words text-lg group-hover:underline" style={{ color: accent }}>{i.value}</div>
            </a>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-xs uppercase tracking-[0.2em] text-stone-400">
        © {year()} {data.title}
      </footer>
      {fab && <WhatsAppFab number={data.whatsapp} />}
    </div>
  );
}
