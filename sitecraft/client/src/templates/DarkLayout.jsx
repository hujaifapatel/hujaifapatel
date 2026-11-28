import { Icon, contactList, hexToRgba, fontStack, year, WhatsAppFab } from './shared.jsx';

// Premium dark theme with glow + glass cards
export default function DarkLayout({ template, data, fab = true }) {
  const { primary, accent, font } = template.theme;
  const c = template.content;
  const contacts = contactList(data);

  return (
    <div className="@container relative overflow-hidden text-slate-300" style={{ background: accent, fontFamily: fontStack('Inter') }}>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: hexToRgba(primary, 0.25) }} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="text-xl font-bold text-white" style={{ fontFamily: fontStack(font) }}>
          {data.title}<span style={{ color: primary }}>.</span>
        </span>
        <nav className="hidden gap-8 text-sm @3xl:flex">
          <a href="#about" className="hover:text-white">About</a>
          <a href="#services" className="hover:text-white">{c.servicesTitle}</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <a href="#contact" className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: hexToRgba(primary, 0.5), color: primary }}>{c.cta}</a>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 text-center @3xl:pt-20">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white @3xl:text-7xl" style={{ fontFamily: fontStack(font) }}>{data.title}</h1>
        {data.tagline && <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">{data.tagline}</p>}
        <a href="#contact" className="mt-10 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold" style={{ background: primary, color: accent, boxShadow: `0 0 40px ${hexToRgba(primary, 0.45)}` }}>
          {c.cta} <Icon name="arrow" className="w-4 h-4" />
        </a>
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-px rounded-3xl" style={{ background: `linear-gradient(135deg, ${hexToRgba(primary, 0.6)}, transparent 60%)` }} />
          <img src={data.image} alt={data.title} className="relative aspect-[16/8] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: primary }}>Our story</span>
        <p className="mt-6 text-2xl leading-relaxed text-slate-200 @3xl:text-3xl" style={{ fontFamily: fontStack(font) }}>{c.about}</p>
      </section>

      <section id="services" className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-4xl font-bold text-white" style={{ fontFamily: fontStack(font) }}>{c.servicesTitle}</h2>
        <div className="mt-12 grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-4">
          {c.services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-white/25">
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 @3xl:p-12">
          <h2 className="text-3xl font-bold text-white @3xl:text-4xl" style={{ fontFamily: fontStack(font) }}>Contact us</h2>
          <div className="mt-8 grid gap-4 @3xl:grid-cols-3">
            {contacts.map((i) => (
              <a key={i.key} href={i.href} target={i.key === 'pin' ? '_blank' : undefined} rel="noreferrer" className="flex items-start gap-4 rounded-2xl p-5 hover:bg-white/5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: hexToRgba(primary, 0.15), color: primary }}>
                  <Icon name={i.icon} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-slate-500">{i.label}</div>
                  <div className="mt-1 break-words text-white">{i.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-slate-500">
        © {year()} {data.title}
      </footer>
      {fab && <WhatsAppFab number={data.whatsapp} />}
    </div>
  );
}
