import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateRenderer } from '../templates/index.jsx';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;600;700&family=Oswald:wght@500;600;700&family=Playfair+Display:wght@500;700;800&family=Poppins:wght@400;500;600;700;800&display=swap';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// App ka compiled Tailwind CSS (same-origin stylesheets) nikalta hai, taaki
// downloaded file bina kisi CDN ke offline bhi bilkul same dikhe.
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

// User ki website ko ek self-contained index.html me convert karta hai
export function buildHtml(template, data) {
  const body = renderToStaticMarkup(<TemplateRenderer template={template} data={data} strict />);
  const title = escapeHtml(data.title || template.name);
  const desc = escapeHtml(data.tagline || '');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
<style>${collectCss()}</style>
<style>html{scroll-behavior:smooth}body{margin:0;background:#fff}</style>
</head>
<body>
${body}
</body>
</html>`;
}

export function downloadHtml(template, data) {
  const html = buildHtml(template, data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const name = (data.title || 'my-website').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  a.href = url;
  a.download = `${name || 'website'}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
