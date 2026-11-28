import { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Helpers shared by all templates. Templates only use inline styles + Tailwind classes
// so the downloaded (static HTML) website looks exactly the same.

export const PAGES = ['home', 'products', 'contact'];

export const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
export const waHref = (p, text = '') =>
  `https://wa.me/${String(p).replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const mapsHref = (a) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
export const mapsEmbed = (a) => `https://maps.google.com/maps?q=${encodeURIComponent(a)}&z=15&output=embed`;

export function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* ------------------------------------------------------------------ */
/* Navigation: the same template is rendered in 3 places               */
/*  - preview : inside the platform (switches pages with state)        */
/*  - router  : the live website /s/:id/products (react-router)        */
/*  - static  : downloaded files index.html / products.html / ...      */
/* Context value: { mode, go, base, siteId, apiBase }                  */
/* ------------------------------------------------------------------ */
export const SiteNavContext = createContext({ mode: 'preview', go: () => {}, base: '', siteId: '', apiBase: '' });

const staticFile = { home: 'index.html', products: 'products.html', contact: 'contact.html' };

export function SiteLink({ to, className, style, children, ...rest }) {
  const nav = useContext(SiteNavContext);
  if (nav.mode === 'router') {
    return (
      <Link to={to === 'home' ? nav.base || '/' : `${nav.base}/${to}`} className={className} style={style} {...rest}>
        {children}
      </Link>
    );
  }
  if (nav.mode === 'static') {
    return <a href={staticFile[to]} className={className} style={style} {...rest}>{children}</a>;
  }
  return (
    <a
      href={`#${to}`}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        nav.go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function navItems(template) {
  return [
    { key: 'home', label: 'Home' },
    { key: 'products', label: template.content.productsLabel || 'Products' },
    { key: 'contact', label: 'Contact' },
  ];
}

/* ------------------------------------------------------------------ */
/* Data merge                                                          */
/* strict=false (preview)    => demo values fill empty fields          */
/* strict=true (final site) => only the user's values                 */
/* ------------------------------------------------------------------ */
export function mergeData(template, data, strict = false) {
  const demo = template?.demo || {};
  const d = data || {};
  const val = (k) => {
    const v = typeof d[k] === 'string' ? d[k].trim() : '';
    return v || (strict ? '' : demo[k] || '');
  };

  const out = {};
  for (const k of ['title', 'tagline', 'description', 'phone', 'email', 'address', 'hours']) out[k] = val(k);
  out.whatsapp = (d.whatsapp || '').trim();

  // Images: in previews, the user's images + the rest from the demo (4 in total)
  const userImages = (d.images || []).filter(Boolean);
  const demoImages = demo.images || [];
  out.images = strict ? userImages : [...userImages, ...demoImages.slice(userImages.length)].slice(0, 4);
  if (!out.images.length) out.images = demoImages.slice(0, 4);

  // Products: if the user has added none yet, the preview shows the demo products
  const userProducts = (d.products || []).filter((p) => p?.name?.trim());
  const base = userProducts.length || strict ? userProducts : demo.products || [];
  out.products = base.map((p, i) => ({
    name: p.name,
    price: p.price || '',
    description: p.description || '',
    image: p.image || (strict ? out.images[i % out.images.length] : demo.products?.[i % (demo.products?.length || 1)]?.image || out.images[0]),
  }));
  return out;
}

// i-th image (repeats if there are fewer images)
export const pic = (data, i) => data.images[i % data.images.length] || '';

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const paths = {
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
};

export function Icon({ name, className = 'w-5 h-5' }) {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c-.01 5.45-4.44 9.89-9.9 9.89m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.41" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

// Phone / WhatsApp / Email / Address / Hours — empty fields are hidden
export function contactList(d) {
  return [
    d.phone && { key: 'phone', icon: 'phone', label: 'Call us', value: d.phone, href: telHref(d.phone) },
    d.whatsapp && { key: 'wa', icon: 'whatsapp', label: 'WhatsApp', value: d.whatsapp, href: waHref(d.whatsapp), external: true },
    d.email && { key: 'mail', icon: 'mail', label: 'Email', value: d.email, href: `mailto:${d.email}` },
    d.address && { key: 'pin', icon: 'pin', label: 'Visit us', value: d.address, href: mapsHref(d.address), external: true },
    d.hours && { key: 'clock', icon: 'clock', label: 'Opening hours', value: d.hours },
  ].filter(Boolean);
}

// "Enquire" button on a product: WhatsApp > Call > Email
export function enquireHref(product, d) {
  const msg = `Hi ${d.title}, I am interested in "${product.name}". Could you share more details?`;
  if (d.whatsapp) return waHref(d.whatsapp, msg);
  if (d.phone) return telHref(d.phone);
  if (d.email) return `mailto:${d.email}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}&body=${encodeURIComponent(msg)}`;
  return '#';
}

// Contact form. Every message is saved in the database (messages collection)
// and the owner reads it on the "Website ready" page.
//  - router (live website): sent with fetch, shows a success message
//  - static (downloaded website): a normal HTML form post to the API
//  - preview (inside the builder): not sent, shows a hint instead
export function ContactForm({ data, primary, dark = false, square = false }) {
  const nav = useContext(SiteNavContext);
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const field = `w-full border px-4 py-3 text-sm outline-none ${square ? '' : 'rounded-xl'} ${
    dark ? 'border-white/15 bg-white/5 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400'
  }`;
  const endpoint = nav.siteId ? `${nav.apiBase || ''}/api/sites/${nav.siteId}/messages` : '';

  const onSubmit = async (e) => {
    if (nav.mode === 'static') return; // normal form post
    e.preventDefault();
    if (nav.mode !== 'router' || !endpoint) {
      setStatus({ state: 'info', text: 'This is a preview. Messages are sent from your live website.' });
      return;
    }
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setStatus({ state: 'sending', text: '' });
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.message || 'Could not send your message');
      form.reset();
      setStatus({ state: 'sent', text: 'Thank you! Your message has been sent. We will get back to you soon.' });
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    }
  };

  if (status.state === 'sent') {
    return (
      <div className={`p-6 text-center ${square ? '' : 'rounded-xl'}`} style={{ background: hexToRgba(primary, 0.12) }}>
        <div className="text-3xl">✅</div>
        <p className={`mt-2 font-medium ${dark ? 'text-white' : 'text-slate-800'}`}>{status.text}</p>
      </div>
    );
  }

  return (
    <form action={nav.mode === 'static' ? endpoint : undefined} method="post" onSubmit={onSubmit} className="space-y-4">
      {/* honeypot field: hidden from people, filled by spam bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 @xl:grid-cols-2">
        <input name="name" required maxLength={80} className={field} placeholder="Your name *" aria-label="Your name" />
        <input name="phone" type="tel" maxLength={30} className={field} placeholder="Phone number" aria-label="Phone number" />
      </div>
      <input name="email" type="email" maxLength={120} className={field} placeholder="Email address" aria-label="Email address" />
      <textarea name="message" required rows={5} maxLength={2000} className={field} placeholder="How can we help you? *" aria-label="Message" />
      {status.text && (
        <p className={`text-sm ${status.state === 'error' ? 'text-red-500' : dark ? 'text-slate-400' : 'text-slate-500'}`}>{status.text}</p>
      )}
      <button
        type="submit"
        disabled={status.state === 'sending'}
        className={`w-full px-6 py-3 font-semibold text-white disabled:opacity-60 ${square ? '' : 'rounded-xl'}`}
        style={{ background: primary }}
      >
        {status.state === 'sending' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}

export function MapEmbed({ address, className = '' }) {
  if (!address) return null;
  return (
    <iframe
      title="Location map"
      src={mapsEmbed(address)}
      loading="lazy"
      className={`h-72 w-full border-0 ${className}`}
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function WhatsAppFab({ number }) {
  if (!number) return null;
  return (
    <a
      href={waHref(number)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}

export const fontStack = (font) => `"${font}", ui-sans-serif, system-ui, sans-serif`;
export const year = () => new Date().getFullYear();
