# SiteCraft — Category-wise Website Builder

Envato Elements jaisa platform jahan user:

1. **Category chunta hai** (Restaurant, Gym, Salon, Portfolio, Business, Real Estate)
2. Us category ke **3–4 templates** dekhta hai (live preview — desktop / tablet / mobile, teeno pages)
3. Template **select** karta hai
4. 4 steps me apna data bharta hai — live preview turant update hota hai:
   - **Basic info:** title, tagline, description
   - **Images:** 3–4 images (hero, about, gallery)
   - **Products:** 1–8 items — naam, price, description, image
   - **Contact:** phone, WhatsApp, email, address, business hours
5. **Website ready!** — 3 pages wali website (**Home, Products, Contact Us**):
   - shareable live link: `/s/:id`, `/s/:id/products`, `/s/:id/contact`
   - **ZIP download** (`index.html`, `products.html`, `contact.html`, `style.css`, `images/`) — offline bhi chalti hai
   - **Edit details** — usi browser se baad me edit kar sakte hain

**Stack:** React 19 + Vite + Tailwind CSS v4 · Node.js + Express · MongoDB Atlas (Mongoose)

---

## Folder structure

```
sitecraft/
├── server/                  # Express API
│   └── src/
│       ├── index.js         # entry (DB connect + auto-seed + listen)
│       ├── app.js           # express app, routes, prod me client/dist serve
│       ├── config/db.js
│       ├── models/          # Category, Template, Site
│       ├── routes/          # categories, templates, sites
│       └── seed/            # 6 categories + 21 templates ka data
└── client/                  # React + Vite + Tailwind
    └── src/
        ├── pages/           # Home, Templates, CategoryPage, TemplatePreview,
        │                    # Customize, SiteReady, LiveSite
        ├── components/      # Navbar, TemplateCard, ScaledFrame, ...
        ├── templates/       # 4 website layouts: Classic, Bold, Minimal, Dark
        └── lib/             # api, image compress, HTML export
```

## Setup

### 1. MongoDB Atlas
1. [cloud.mongodb.com](https://cloud.mongodb.com) par free cluster banayein
2. **Database Access** me user banayein, **Network Access** me apna IP (ya `0.0.0.0/0`) allow karein
3. **Connect → Drivers** se connection string copy karein

### 2. Env file
```bash
cp server/.env.example server/.env
```
`server/.env` me `MONGODB_URI` daalein.

### 3. Install & run
```bash
npm run install-all
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000

Pehli baar server start hone par categories + templates **automatic seed** ho jaate hain.
Seed data badalne ke baad dobara chalane ke liye: `npm run seed`.

### Production
```bash
npm run build   # client/dist banega
npm start       # Express API + React build dono ek hi port par
```
Render / Railway par deploy karte waqt build command `npm run install-all && npm run build`
aur start command `npm start` rakhein. Frontend alag (Vercel) par ho to `client/.env` me `VITE_API_URL` set karein.

## API

| Method | Route | Kaam |
| --- | --- | --- |
| GET | `/api/categories` | Sab categories (+ template count) |
| GET | `/api/categories/:slug` | Ek category |
| GET | `/api/templates?category=&featured=&q=` | Templates list / filter / search |
| GET | `/api/templates/:id` | Ek template (id ya slug) |
| POST | `/api/sites` | `{ templateId, data }` → site save, response me `{ _id, editKey }` |
| PUT | `/api/sites/:id` | Header `x-edit-key` ke saath site update |
| GET | `/api/sites/:id` | Saved site (template ke saath) |

## Kaise kaam karta hai

- **Templates** MongoDB me metadata ke roop me store hote hain: `layout` (classic/bold/minimal/dark), `theme` colors + font, category-specific content (about, services) aur demo data.
- Frontend par har `layout` ek React component hai jisme 3 pages hain (Home / Products / Contact). Template + user data merge hokar render hota hai — isliye ek layout se alag-alag categories ke liye alag look banta hai. Products page ka naam category ke hisab se badalta hai (Menu, Plans, Services, Packages, Properties).
- `site.data` ka shape:
  ```js
  {
    title, tagline, description,
    images: [dataUrl, dataUrl, dataUrl, dataUrl?],          // 3-4
    products: [{ name, price, description, image }],        // 1-8
    phone, whatsapp, email, address, hours
  }
  ```
- Product ka "Enquire" button WhatsApp (pre-filled message) → call → email par jaata hai. Contact page par contact form (email app khulta hai) aur Google Map hai.
- Templates **container queries** (`@container`, `@3xl:`) use karte hain, isliye scaled thumbnails, device preview aur real website — sab jagah sahi responsive layout aata hai.
- Images browser me hi resize/compress (1400px / products 900px JPEG) hokar base64 me MongoDB me save hoti hain — alag file storage ki zarurat nahi. Zyada traffic ho to Cloudinary/S3 par shift karna behtar hai.
- **Download ZIP** teeno pages ko `renderToStaticMarkup` se static HTML banata hai, compiled CSS `style.css` me aur images `images/` folder me daalta hai — offline bhi bilkul waisi hi dikhti hai.

## Naya template kaise add karein

- **Naya color/content variant:** `server/src/seed/data.js` me `plan` ke andar ek line add karein, phir `npm run seed`.
- **Naya layout:** `client/src/templates/` me component banayein, `templates/index.jsx` ke `layouts` me register karein, aur `server/src/models/Template.js` ke `layout` enum me naam add karein.
- **Nayi category:** `data.js` me `categories`, `content`, `demo` aur `plan` me entry add karein.
