import { Icon, contactList, hexToRgba, fontStack, year, WhatsAppFab } from './shared.jsx';

// Light theme, split hero (text left, image right)
export default function ClassicLayout({ template, data, fab = true }) {
  const { primary, accent, font } = template.theme;
  const c = template.content;
  const contacts = contactList(data);

  return (
    <div className="@container bg-white text-slate-700" style={{ fontFamily: fontStack('Inter') }}>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className="text-xl font-bold" style={{ color: accent, fontFamily: fontStack(font) }}>{data.title}</span>
          <nav className="hidden items-center gap-8 text-sm font-medium @3xl:flex">
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#services" className="hover:opacity-70">{c.servicesTitle}</a>
            <a href="#contact" className="hover:opacity-70">Contact</a>
          </nav>
          <a href="#contact" className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ background: primary }}>{c.cta}</a>
        </div>
      </header>

      <section style={{ background: `linear-gradient(180deg, ${hexToRgba(primary, 0.08)}, #fff)` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 @3xl:grid-cols-2 @3xl:py-24">
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ background: hexToRgba(primary, 0.12), color: primary }}>
              Welcome
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight @3xl:text-6xl" style={{ color: accent, fontFamily: fontStack(font) }}>{data.title}</h1>
            {data.tagline && <p className="mt-5 max-w-md text-lg text-slate-500">{data.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg" style={{ background: primary, boxShadow: `0 10px 25px ${hexToRgba(primary, 0.35)}` }}>
                {c.cta} <Icon name="arrow" className="w-4 h-4" />
              </a>
              <a href="#services" className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">Explore</a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] rotate-2" style={{ background: hexToRgba(primary, 0.15) }} />
            <img src={data.image} alt={data.title} className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>About us</h2>
        <p className="mt-5 text-2xl leading-relaxed text-slate-600 @3xl:text-3xl" style={{ fontFamily: fontStack(font) }}>{c.about}</p>
      </section>

      <section id="services" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-bold @3xl:text-4xl" style={{ color: accent, fontFamily: fontStack(font) }}>{c.servicesTitle}</h2>
          <div className="mt-12 grid gap-6 @xl:grid-cols-2 @4xl:grid-cols-4">
            {c.services.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: hexToRgba(primary, 0.1) }}>{s.icon}</div>
                <h3 className="mt-5 text-lg font-semibold" style={{ color: accent }}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
        <div className="overflow-hidden rounded-3xl p-8 text-white @3xl:p-14" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          <h2 className="text-3xl font-bold @3xl:text-4xl" style={{ fontFamily: fontStack(font) }}>Get in touch</h2>
          <p className="mt-3 max-w-lg text-white/80">Koi sawal ho ya booking karni ho — hum bas ek call door hain.</p>
          <div className="mt-10 grid gap-4 @3xl:grid-cols-3">
            {contacts.map((i) => (
              <a key={i.key} href={i.href} target={i.key === 'pin' ? '_blank' : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 hover:bg-white/15">
                <Icon name={i.icon} className="mt-0.5 w-6 h-6 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-white/60">{i.label}</div>
                  <div className="mt-1 break-words font-medium">{i.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {year()} {data.title}. All rights reserved.
      </footer>
      {fab && <WhatsAppFab number={data.whatsapp} />}
    </div>
  );
}
