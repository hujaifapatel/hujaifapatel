import JSZip from 'jszip';
import { absoluteApiBase } from './api.js';

// Source code of the templates, bundled as plain text (Vite "?raw" imports).
// The exported project gets the exact same React components the builder uses.
import sharedSrc from '../templates/shared.jsx?raw';
import classicSrc from '../templates/ClassicLayout.jsx?raw';
import boldSrc from '../templates/BoldLayout.jsx?raw';
import minimalSrc from '../templates/MinimalLayout.jsx?raw';
import darkSrc from '../templates/DarkLayout.jsx?raw';

const LAYOUTS = {
  classic: { file: 'ClassicLayout.jsx', src: classicSrc },
  bold: { file: 'BoldLayout.jsx', src: boldSrc },
  minimal: { file: 'MinimalLayout.jsx', src: minimalSrc },
  dark: { file: 'DarkLayout.jsx', src: darkSrc },
};

const FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;600;700&family=Oswald:wght@500;600;700&family=Playfair+Display:wght@500;700;800&family=Poppins:wght@400;500;600;700;800&display=swap';

const slugify = (s) => (s || 'my-website').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'website';
const json = (v) => JSON.stringify(v, null, 2) + '\n';
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Moves base64 images into public/images/* and returns the data with "/images/..." paths
function extractImages(data) {
  const files = [];
  const seen = new Map();
  const toFile = (src, name) => {
    const m = /^data:image\/(png|jpe?g|webp|gif);base64,(.*)$/.exec(src || '');
    if (!m) return src || '';
    if (seen.has(src)) return seen.get(src);
    const path = `/images/${name}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
    files.push({ path: `public${path}`, base64: m[2] });
    seen.set(src, path);
    return path;
  };
  return {
    files,
    data: {
      ...data,
      images: (data.images || []).map((src, i) => toFile(src, `photo-${i + 1}`)),
      products: (data.products || []).map((p, i) => ({ ...p, image: p.image ? toFile(p.image, `product-${i + 1}`) : '' })),
    },
  };
}

function projectFiles({ template, data, siteId, name }) {
  const layout = LAYOUTS[template.layout] || LAYOUTS.classic;
  const layoutName = layout.file.replace('.jsx', '');
  const productsLabel = template.content?.productsLabel || 'Products';

  // Only what the website needs from the template record
  const templateJson = {
    name: template.name,
    layout: template.layout,
    theme: template.theme,
    content: template.content,
  };

  return {
    'package.json': json({
      name,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
      dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0', 'react-router-dom': '^7.1.1' },
      devDependencies: {
        '@tailwindcss/vite': '^4.0.0',
        '@vitejs/plugin-react': '^4.3.4',
        tailwindcss: '^4.0.0',
        vite: '^6.0.7',
      },
    }),

    'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`,

    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.title)}</title>
    <meta name="description" content="${escapeHtml(data.tagline || data.description || '')}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${FONTS}" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,

    '.gitignore': 'node_modules\ndist\n.env\n',

    // SPA routing on Netlify and Vercel (so /products and /contact work after a refresh)
    'public/_redirects': '/*  /index.html  200\n',
    'vercel.json': json({ rewrites: [{ source: '/(.*)', destination: '/index.html' }] }),

    'src/index.css': `@import "tailwindcss";

html { scroll-behavior: smooth; }
body { margin: 0; background: #fff; }
`,

    'src/main.jsx': `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
`,

    'src/App.jsx': `import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ${layoutName} from './templates/${layout.file}';
import { SiteNavContext, mergeData } from './templates/shared.jsx';
import site from './data/site.json';
import template from './data/template.json';
import config from './config.js';

// The website data (site.json) merged with the template settings (template.json)
const data = mergeData(template, site, true);

// Used by the template's links and by the contact form
const nav = { mode: 'router', base: '', siteId: config.siteId, apiBase: config.apiUrl };

const titles = { home: '', products: template.content.productsLabel, contact: 'Contact' };

function Page({ page }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = titles[page] ? \`\${titles[page]} — \${data.title}\` : data.title;
  }, [pathname, page]);
  return <${layoutName} template={template} data={data} page={page} />;
}

export default function App() {
  return (
    <SiteNavContext.Provider value={nav}>
      <Routes>
        <Route path="/" element={<Page page="home" />} />
        <Route path="/products" element={<Page page="products" />} />
        <Route path="/contact" element={<Page page="contact" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteNavContext.Provider>
  );
}
`,

    'src/config.js': `// Contact form messages are sent to the SiteCraft API and saved in its database,
// so they show up in the "Messages" inbox of this website on SiteCraft.
export default {
  siteId: ${JSON.stringify(siteId)},
  apiUrl: ${JSON.stringify(absoluteApiBase())},
};
`,

    // ---- the user's real data ----
    'src/data/site.json': json(data),
    'src/data/template.json': json(templateJson),

    // ---- the template's React source code ----
    'src/templates/shared.jsx': sharedSrc,
    [`src/templates/${layout.file}`]: layout.src,

    'README.md': `# ${data.title}

Website built with **SiteCraft** using the **${template.name}** template.
A React + Vite + Tailwind CSS project with 3 pages: **Home**, **${productsLabel}** and **Contact**.

## Run it

\`\`\`bash
npm install
npm run dev
\`\`\`

Then open http://localhost:5173

## Build for hosting

\`\`\`bash
npm run build
\`\`\`

Upload the \`dist\` folder to any static hosting (Netlify, Vercel, GitHub Pages, cPanel).
\`public/_redirects\` (Netlify) and \`vercel.json\` (Vercel) make the /${'products'} and /contact pages work after a refresh.

## Where things are

| File | What it contains |
| --- | --- |
| \`src/data/site.json\` | **Your content**: title, tagline, description, images, products, contact details |
| \`src/data/template.json\` | Template settings: layout, colours, font, section texts |
| \`public/images/\` | Your images |
| \`src/templates/${layout.file}\` | The layout: Home, ${productsLabel} and Contact pages |
| \`src/templates/shared.jsx\` | Shared pieces: icons, contact form, links, data helpers |
| \`src/App.jsx\` | Routes: \`/\`, \`/products\`, \`/contact\` |
| \`src/config.js\` | Where contact form messages are sent |

To change a product, price, phone number or any text, edit \`src/data/site.json\` and save — the page updates instantly in \`npm run dev\`.
To change colours, edit \`theme\` in \`src/data/template.json\`.

## Contact form

Messages are sent to \`${absoluteApiBase()}\` and saved in the SiteCraft database, where you can read them in your website's **Messages** inbox.
If you change \`apiUrl\` in \`src/config.js\` you can point the form at your own backend instead.
`,
  };
}

// Downloads the user's website as a React + Vite + Tailwind project (ZIP)
export async function downloadReactProject(template, rawData, siteId) {
  const { data, files } = extractImages(rawData);
  const name = slugify(rawData.title);
  const zip = new JSZip();
  const root = zip.folder(name);
  for (const [path, content] of Object.entries(projectFiles({ template, data, siteId, name }))) root.file(path, content);
  for (const f of files) root.file(f.path, f.base64, { base64: true });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-react.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
