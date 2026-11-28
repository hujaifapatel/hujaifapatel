import { Icon, contactList, hexToRgba, fontStack, year, WhatsAppFab } from './shared.jsx';

// Full-bleed image hero with overlay, big typography
export default function BoldLayout({ template, data, fab = true }) {
  const { primary, accent, font } = template.theme;
  const c = template.content;
  const contacts = contactList(data);

  return (
    <div className="@container bg-white text-slate-800" style={{ fontFamily: fontStack('Inter') }}>
      <section className="relative flex min-h-[640px] flex-col overflow-hidden text-white">
        <img src={data.image} alt={data.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, ${hexToRgba(accent, 0.92)} 20%, ${hexToRgba(accent, 0.35)})` }} />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
          <span className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: fontStack(font) }}>{data.title}</span>
          <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-wider @3xl:flex">
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#services" className="hover:opacity-70">{c.servicesTitle}</a>
            <a href="#contact" className="hover:opacity-70">Contact</a>
          </nav>
        </header>
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-20">
          <div className="mb-6 h-1.5 w-20 rounded-full" style={{ background: primary }} />
          <h1 className="max-w-3xl text-5xl font-bold uppercase leading-[0.95] @3xl:text-7xl @5xl:text-8xl" style={{ fontFamily: fontStack(font) }}>{data.title}</h1>
          {data.tagline && <p className="mt-6 max-w-xl text-xl text-white/85">{data.tagline}</p>}
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider" style={{ background: primary, color: '#fff' }}>
              {c.cta} <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 @3xl:grid-cols-[1fr_2fr]">
          <h2 className="text-4xl font-bold uppercase" style={{ color: accent, fontFamily: fontStack(font) }}>
            Who<br />we are<span style={{ color: primary }}>.</span>
          </h2>
          <p className="text-xl leading-relaxed text-slate-600">{c.about}</p>
        </div>
      </section>

      <section id="services" className="py-20" style={{ background: accent }}>
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-bold uppercase text-white" style={{ fontFamily: fontStack(font) }}>{c.servicesTitle}</h2>
          <div className="mt-12 grid gap-px overflow-hidden bg-white/10 @xl:grid-cols-2 @4xl:grid-cols-4">
            {c.services.map((s, i) => (
              <div key={s.title} className="p-8" style={{ background: accent }}>
                <div className="text-5xl font-bold" style={{ color: primary, fontFamily: fontStack(font) }}>0{i + 1}</div>
                <h3 className="mt-6 text-xl font-bold text-white">{s.icon} {s.title}</h3>
                <p className="mt-3 text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 @3xl:grid-cols-2">
            <div>
              <h2 className="text-5xl font-bold uppercase leading-none" style={{ color: accent, fontFamily: fontStack(font) }}>
                Let's<br />talk<span style={{ color: primary }}>.</span>
              </h2>
              <p className="mt-5 text-lg text-slate-500">Aaj hi contact karein aur pehla step lein.</p>
            </div>
            <div className="space-y-4">
              {contacts.map((i) => (
                <a key={i.key} href={i.href} target={i.key === 'pin' ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-5 border-l-4 bg-slate-50 p-5 hover:bg-slate-100" style={{ borderColor: primary }}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center text-white" style={{ background: primary }}><Icon name={i.icon} /></span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{i.label}</div>
                    <div className="break-words text-lg font-semibold" style={{ color: accent }}>{i.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-white/60" style={{ background: accent }}>
        © {year()} {data.title}
      </footer>
      {fab && <WhatsAppFab number={data.whatsapp} />}
    </div>
  );
}
