import { renderToStaticMarkup } from 'react-dom/server';
import JSZip from 'jszip';
import { TemplateRenderer } from '../templates/index.jsx';
import { absoluteApiBase } from './api.js';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;600;700&family=Oswald:wght@500;600;700&family=Playfair+Display:wght@500;700;800&family=Poppins:wght@400;500;600;700;800&display=swap';

const FILES = { home: 'index.html', products: 'products.html', contact: 'contact.html' };

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// The app's compiled Tailwind CSS (same-origin stylesheets), so the downloaded site looks the same without a CDN
function collectCss() {
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + '\n';
    } catch {
      // cross-origin (Google Fonts) — skipped, it is loaded with a <link>
    }
  }
  return css.replace(/<\/style/gi, '<\\/style');
}

// Moves base64 images into separate files (images/...) and puts their paths in the data
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

function pageHtml(template, data, page, nav) {
  const body = renderToStaticMarkup(
    <TemplateRenderer template={template} data={data} page={page} nav={nav} strict />
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

// Downloads the user's website as a ZIP:
// index.html, products.html, contact.html, style.css, images/*
// The contact form posts to the SiteCraft API, so messages still reach the database.
export async function downloadSite(template, rawData, siteId) {
  const { data, files } = extractImages(rawData);
  const nav = { mode: 'static', siteId, apiBase: absoluteApiBase() };
  const zip = new JSZip();
  zip.file('style.css', `${collectCss()}\nhtml{scroll-behavior:smooth}body{margin:0;background:#fff}`);
  for (const [page, file] of Object.entries(FILES)) zip.file(file, pageHtml(template, data, page, nav));
  for (const f of files) zip.file(f.path, f.base64, { base64: true });
  zip.file('README.txt', `${data.title} — website\n\nOpen index.html in your browser.\nTo publish it, upload the whole folder to any hosting (Netlify, GitHub Pages, cPanel).\nContact form messages are saved to your SiteCraft dashboard.\n`);

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
