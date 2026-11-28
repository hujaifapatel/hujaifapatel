// Templates ke common helpers. Templates sirf inline styles + Tailwind classes use karte hain
// taaki "Download HTML" me bhi exactly waise hi dikhein.

export const telHref = (p) => `tel:${String(p).replace(/[^\d+]/g, '')}`;
export const waHref = (p) => `https://wa.me/${String(p).replace(/\D/g, '')}`;
export const mapsHref = (a) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;

export function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Template + user data ko merge karta hai.
// strict=false (preview) => khali field me demo value dikhegi
// strict=true (final site) => sirf user ki value; khali contact hide ho jayega
export function mergeData(template, data, strict = false) {
  const demo = template?.demo || {};
  const d = data || {};
  const keys = ['title', 'tagline', 'image', 'phone', 'email', 'address'];
  const out = { whatsapp: d.whatsapp || '' };
  for (const k of keys) {
    const v = typeof d[k] === 'string' ? d[k].trim() : d[k];
    out[k] = v || (strict ? '' : demo[k] || '');
  }
  return out;
}

const paths = {
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
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

// Phone / Email / Address list — jo field khali hai wo hide
export function contactList(d) {
  return [
    d.phone && { key: 'phone', icon: 'phone', label: 'Call us', value: d.phone, href: telHref(d.phone) },
    d.email && { key: 'mail', icon: 'mail', label: 'Email', value: d.email, href: `mailto:${d.email}` },
    d.address && { key: 'pin', icon: 'pin', label: 'Visit us', value: d.address, href: mapsHref(d.address) },
  ].filter(Boolean);
}

export function WhatsAppFab({ number }) {
  if (!number) return null;
  return (
    <a
      href={waHref(number)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    >
      <Icon name="whatsapp" className="w-7 h-7" />
    </a>
  );
}

export const fontStack = (font) => `"${font}", ui-sans-serif, system-ui, sans-serif`;
export const year = () => new Date().getFullYear();
