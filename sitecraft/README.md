# SiteCraft — Category-based Website Builder

A platform (similar in spirit to Envato Elements) where a user:

1. **Picks a category** — **Shops & Stores:** Mobile & Electronics, Fashion, Grocery, Jewellery, Furniture, Bakery, Cosmetics · **Services:** Restaurant, Gym, Salon, Portfolio, Business, Real Estate
2. Browses the **3–4 templates** of that category (live preview on desktop / tablet / mobile, all three pages)
3. **Selects** a template
4. Fills in their data in 4 steps, with a live preview that updates instantly:
   - **Basic info:** title, tagline, description
   - **Images:** 3–4 images (hero, about, gallery)
   - **Products:** 1–12 items — name, price, description, image
   - **Contact:** phone, WhatsApp, email, address, business hours
5. **Gets a 3-page website** (**Home, Products, Contact Us**):
   - a shareable live link: `/s/:id`, `/s/:id/products`, `/s/:id/contact`
   - a **React project download** (ZIP): a React + Vite + Tailwind project with the user's data in `src/data/site.json`, images in `public/images/` and the template's JSX source — run it with `npm install` + `npm run dev`
   - optionally plain HTML files (`index.html`, `products.html`, `contact.html`) that also work offline
   - a **Contact form** whose messages are saved in MongoDB and shown in the owner's inbox
   - **Edit website** later from the same browser (see **My Websites**) — every saved field is loaded back into the form

**Stack:** React 19 + Vite + Tailwind CSS v4 · Node.js + Express · MongoDB Atlas (Mongoose)

---

## Folder structure

```
sitecraft/
├── server/                  # Express API
│   └── src/
│       ├── index.js         # entry point (connect DB, sync seed data, listen)
│       ├── app.js           # express app and routes; serves client/dist in production
│       ├── config/db.js
│       ├── models/          # Category, Template, Site, Message
│       ├── routes/          # categories, templates, sites (+ messages)
│       └── seed/            # data.js + shops.js = 13 categories, 45 templates
└── client/                  # React + Vite + Tailwind
    └── src/
        ├── pages/           # Home, Templates, CategoryPage, TemplatePreview,
        │                    # Customize, SiteReady, MySites, LiveSite
        ├── components/      # Navbar, TemplateCard, ScaledFrame, MessagesInbox, ...
        ├── templates/       # 4 website layouts: Classic, Bold, Minimal, Dark
        └── lib/             # api, image compression, React project export, HTML export
```

## Setup

### 1. MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add a user under **Database Access** and allow your IP (or `0.0.0.0/0`) under **Network Access**
3. Copy the connection string from **Connect → Drivers**

### 2. Environment file
```bash
cp server/.env.example server/.env
```
Put your `MONGODB_URI` in `server/.env`. Include the database name (`.../sitecraft?...`), otherwise MongoDB uses a database called `test`.

### 3. Install and run
```bash
npm run install-all
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000

Every time the server starts it syncs the categories and templates from `server/src/seed/` into the database (upsert — user websites and messages are never touched). You can also run it manually with `npm run seed`.

### Production
```bash
npm run build   # builds client/dist
npm start       # Express serves the API and the React build on one port
```
On Render / Railway use `npm run install-all && npm run build` as the build command and `npm start` as the start command. If the frontend is hosted separately (e.g. Vercel), set `VITE_API_URL` in `client/.env`.

## Database collections

| Collection | What it stores | Written by |
| --- | --- | --- |
| `categories` | 13 categories | seed files |
| `templates` | 45 template designs: layout, colours, demo content | seed files |
| `sites` | Each user's website: template + all entered data | the user (builder form) |
| `messages` | Contact form messages sent by website visitors | visitors of the generated websites |

Shape of `site.data`:
```js
{
  title, tagline, description,
  images: [dataUrl, dataUrl, dataUrl, dataUrl?],          // 3-4
  products: [{ name, price, description, image }],        // 1-12
  phone, whatsapp, email, address, hours
}
```

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/categories` | All categories (+ template count) |
| GET | `/api/categories/:slug` | One category |
| GET | `/api/templates?category=&featured=&q=` | List / filter / search templates |
| GET | `/api/templates/:id` | One template (id or slug) |
| POST | `/api/sites` | `{ templateId, data }` → saves a website, returns `{ _id, editKey }` |
| GET | `/api/sites/:id` | A saved website (with its template) |
| PUT | `/api/sites/:id` | Updates a website (header `x-edit-key`) |
| POST | `/api/sites/:id/view` | Counts a visit to the live website |
| POST | `/api/sites/:id/messages` | A visitor sends a contact message (JSON or HTML form post) |
| GET | `/api/sites/:id/messages` | Owner reads messages (header `x-edit-key`) |
| PATCH | `/api/sites/:id/messages/:messageId` | Mark as read / unread (header `x-edit-key`) |
| DELETE | `/api/sites/:id/messages/:messageId` | Delete a message (header `x-edit-key`) |

## How it works

- **Templates** are stored in MongoDB as data: a `layout` (classic / bold / minimal / dark), `theme` colours and font, category-specific content (features, products page name) and demo data.
- Each `layout` is a React component with 3 pages (Home / Products / Contact). The template and the user's data are merged when rendering, so one layout gives a different look for every category. The products page name follows the category (Menu, Plans, Services, Packages, Collection, Properties, Products).
- Templates use **container queries** (`@container`, `@3xl:`), so the scaled thumbnails, the device preview and the real website all get the right responsive layout.
- Images are resized and compressed in the browser (1400px, products 900px, JPEG) and stored as base64 in MongoDB — no separate file storage needed. For high traffic, moving them to Cloudinary or S3 is recommended.
- **Edit without an account:** creating a website returns a secret `editKey`, which is stored in the creator's browser. It is required to edit the site and to read its messages. **My Websites** lists the websites created in the current browser.
- **Contact form:** the live website sends messages with `fetch`; the downloaded website uses a normal HTML form post to the same API (which replies with a "Thank you" page). Spam bots are filtered with a hidden honeypot field.
- **Download React project** builds a ZIP in the browser (JSZip) with a ready-to-run Vite project:
  ```
  my-website/
  ├── package.json, vite.config.js, index.html, vercel.json
  ├── public/images/              # the user's images (from base64)
  ├── public/_redirects           # SPA routing on Netlify
  └── src/
      ├── main.jsx, App.jsx       # routes: /, /products, /contact
      ├── config.js               # site id + API URL for the contact form
      ├── data/site.json          # the user's content
      ├── data/template.json      # layout, colours, font, section texts
      └── templates/              # the chosen layout + shared.jsx (same source the builder uses, via Vite ?raw imports)
  ```
- **Plain HTML download** renders the three pages with `renderToStaticMarkup`, puts the compiled CSS in `style.css` and the images in `images/`.

## Adding templates

- **A new colour/content variant:** add a line to `plan` in `server/src/seed/data.js` (or `shopPlan` in `shops.js`) and restart the server.
- **A new shop category:** add an entry to each object in `server/src/seed/shops.js` (`shopCategories`, `shopContent`, `shopDemo`, `shopPlan`).
- **A new layout:** create a component in `client/src/templates/`, register it in `layouts` in `templates/index.jsx`, and add its name to the `layout` enum in `server/src/models/Template.js`.
