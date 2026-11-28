import { renderToStaticMarkup } from 'react-dom/server';
import JSZip from 'jszip';
import { TemplateRenderer } from '../templates/index.jsx';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;600;700&family=Oswald:wght@500;600;700&family=Playfair+Display:wght@500;700;800&family=Poppins:wght@400;500;600;700;800&display=swap';

const FILES = { home: 'index.html', products: 'products.html', contact: 'contact.html' };

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// App ka compiled Tailwind CSS (same-origin stylesheets) — downloaded site bina CDN ke same dikhe
function collectCss() {
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + '\n';
    } catch {
      // cross-origin (Google Fonts) — skip, wo <link> se load hota hai
    }
  }
  return css.replace(/<\/style/gi, '<\\/style');
}

// base64 images ko alag files (images/...) me nikaal kar data me unka path daalta hai
function extractImages(data) {
  const files = [];
  const seen = new Map();
  const toFile = (src, name) => {
    const m = /^data:image\/(png|jpe?g|webp|gif);base64,(.*)$/.exec(src || '');
    if (!m) return src; // already a URL
    if (seen.has(src)) return seen.get(src);
    const path = `images/${name}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
    files.push({ path, base64: m[2] });
    seen.set(src, path);
    return path;
  };
  const out = {
    ...data,
    images: (data.images || []).map((src, i) => toFile(src, `photo-${i + 1}`)),
    products: (data.products || []).map((p, i) => ({ ...p, image: p.image ? toFile(p.image, `product-${i + 1}`) : '' })),
  };
  return { data: out, files };
}

function pageHtml(template, data, page) {
  const body = renderToStaticMarkup(
    <TemplateRenderer template={template} data={data} page={page} nav={{ mode: 'static' }} strict />
  );
  const label = { home: '', products: template.content?.productsLabel || 'Products', contact: 'Contact' }[page];
  const title = escapeHtml(label ? `${label} — ${data.title}` : data.title);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${escapeHtml(data.tagline || data.description || '')}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
<link href="style.css" rel="stylesheet" />
</head>
<body>
${body}
</body>
</html>`;
}

// User ki website ko ZIP me download karta hai:
// index.html, products.html, contact.html, style.css, images/*
export async function downloadSite(template, rawData) {
  const { data, files } = extractImages(rawData);
  const zip = new JSZip();
  zip.file('style.css', `${collectCss()}\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff}`);
  for (const [page, file] of Object.entries(FILES)) zip.file(file, pageHtml(template, data, page));
  for (const f of files) zip.file(f.path, f.base64, { base64: true });
  zip.file('README.txt', `${data.title} — website\n\nindex.html ko browser me kholiye.\nKisi bhi hosting (Netlify, GitHub Pages, cPanel) par poora folder upload kar dein.\n`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const name = (data.title || 'my-website').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'website';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
