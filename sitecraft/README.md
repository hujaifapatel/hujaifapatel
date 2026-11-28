# SiteCraft — Category-based Website Builder

SiteCraft lets a small business owner create a complete website in a few minutes, without writing code.
The user picks a **category** (mobile store, restaurant, gym …), chooses one of its **templates**, fills in
their own **images, products and contact details**, and gets a **3-page website** (Home, Products, Contact)
with a shareable link, a downloadable **React project**, and an **inbox** for messages sent by visitors.

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · React Router 7 · Node.js · Express 4 · MongoDB Atlas · Mongoose 8

---

## Table of contents

1. [Features](#1-features)
2. [Quick start](#2-quick-start)
3. [Project structure](#3-project-structure)
4. [Architecture](#4-architecture)
5. [How frontend and backend run together](#5-how-frontend-and-backend-run-together)
6. [Database](#6-database)
7. [Backend](#7-backend)
8. [API reference](#8-api-reference)
9. [Frontend](#9-frontend)
10. [The template system](#10-the-template-system)
11. [End-to-end flows](#11-end-to-end-flows)
12. [Downloads (React project and HTML)](#12-downloads-react-project-and-html)
13. [How to extend the project](#13-how-to-extend-the-project)
14. [Deployment](#14-deployment)
15. [Security](#15-security)
16. [Limitations and roadmap](#16-limitations-and-roadmap)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Features

| Area | What it does |
| --- | --- |
| **Categories** | 13 categories in two groups — **Shops & Stores** (Mobile & Electronics, Fashion, Grocery, Jewellery, Furniture, Bakery, Cosmetics) and **Services** (Restaurant, Gym, Salon, Portfolio, Business, Real Estate) |
| **Templates** | 45 templates (3–4 per category) built from 4 layouts: Classic, Bold, Minimal, Dark |
| **Preview** | Live preview of all 3 pages on desktop / tablet / mobile before choosing |
| **Builder form** | 4 steps — Basic info, Images (3–4), Products (1–12), Contact — with a live preview next to the form |
| **Generated website** | 3 pages: **Home**, **Products** (named per category: Menu, Plans, Collection …) and **Contact** |
| **Live link** | `/s/:id`, `/s/:id/products`, `/s/:id/contact`, with a visit counter |
| **Contact form** | Visitor messages are saved in MongoDB; the owner reads them in an inbox (mark read / delete) |
| **Product enquiry** | "Enquire now" opens WhatsApp with a pre-filled message (or a call / email) |
| **Edit** | The owner can edit everything later — every saved field is loaded back into the form |
| **My Websites** | Lists every website created in the current browser |
| **Download** | A ready-to-run **React + Vite + Tailwind project** (ZIP), or plain HTML files |
| **Language** | All UI, templates and content are in English |

---

## 2. Quick start

### Requirements
- Node.js 18 or newer (developed on Node 22)
- A free MongoDB Atlas cluster

### 1. MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → add a database user.
3. **Network Access** → allow your IP (or `0.0.0.0/0` while developing).
4. **Connect → Drivers** → copy the connection string.

### 2. Environment file
```bash
cp server/.env.example server/.env
```
```env
# server/.env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/sitecraft?retryWrites=true&w=majority
PORT=5000
```
> Put the database name (`/sitecraft`) in the URI. Without it MongoDB uses a database called `test`.
> Never commit `server/.env` — it is in `.gitignore`.

### 3. Install and run
```bash
npm run install-all   # installs root, server and client packages
npm run dev           # starts the API (5000) and the React app (5173) together
```
Open **http://localhost:5173**. On start the server prints:
```
[api] ✅ MongoDB connected: ...
[api] 🌱 Synced 13 categories and 45 templates
[api] 🚀 API running on http://localhost:5000
[web] ➜  Local: http://localhost:5173/
```

### npm scripts

| Where | Script | What it does |
| --- | --- | --- |
| root | `npm run install-all` | `npm install` in root, `server/` and `client/` |
| root | `npm run dev` | API + React app together (via `concurrently`) |
| root | `npm run build` | Builds the React app into `client/dist` |
| root | `npm start` | Starts Express in production mode (serves API + `client/dist`) |
| root | `npm run seed` | Syncs categories and templates into the database |
| server | `npm run dev` | `node --watch src/index.js` (auto-restart on save) |
| client | `npm run dev` | Vite dev server with hot reload |

---

## 3. Project structure

```
sitecraft/
├── package.json                 # root scripts (install-all, dev, build, start, seed) + concurrently
├── README.md
│
├── server/                      # ───────── BACKEND (Node + Express + Mongoose) ─────────
│   ├── .env.example             # MONGODB_URI, PORT
│   ├── package.json             # express, mongoose, cors, dotenv
│   └── src/
│       ├── index.js             # entry: connect DB → sync seed → start server
│       ├── app.js               # express app: middleware, routes, static React build, error handler
│       ├── config/
│       │   └── db.js            # mongoose.connect(MONGODB_URI)
│       ├── models/
│       │   ├── Category.js      # a category (slug, icon, group …)
│       │   ├── Template.js      # a template design (layout, theme, content, demo data)
│       │   ├── Site.js          # a user's website (template + all entered data + editKey)
│       │   └── Message.js       # a contact form message (belongs to a Site)
│       ├── routes/
│       │   ├── categories.js    # GET categories
│       │   ├── templates.js     # GET templates (filter / search)
│       │   ├── sites.js         # create / read / update a website, count views, owner check
│       │   └── messages.js      # send / list / mark / delete contact messages
│       └── seed/
│           ├── data.js          # service categories + mobile store, their content, demo data, templates
│           ├── shops.js         # shop categories (fashion, grocery, jewellery, furniture, bakery, cosmetics)
│           └── seed.js          # upserts categories + templates into MongoDB
│
└── client/                      # ───────── FRONTEND (React + Vite + Tailwind) ─────────
    ├── index.html               # HTML shell + Google Fonts
    ├── vite.config.js           # React + Tailwind plugins, /api proxy → localhost:5000
    ├── .env.example             # VITE_API_URL (only if API is on another domain)
    └── src/
        ├── main.jsx             # React root + BrowserRouter
        ├── App.jsx              # all routes + navbar/footer (hidden on /s/* live websites)
        ├── index.css            # Tailwind import + brand colours
        ├── pages/               # one file per route (see section 9)
        ├── components/          # reusable UI pieces (see section 9)
        ├── templates/           # the website templates (see section 10)
        │   ├── shared.jsx       # links, data merge, icons, contact form, map, WhatsApp button
        │   ├── index.jsx        # TemplateRenderer — the single entry point for rendering a template
        │   ├── ClassicLayout.jsx
        │   ├── BoldLayout.jsx
        │   ├── MinimalLayout.jsx
        │   └── DarkLayout.jsx
        └── lib/
            ├── api.js           # every API call + edit key storage (localStorage)
            ├── useFetch.js      # small data-loading hook { data, loading, error }
            ├── image.js         # resize + compress images in the browser
            ├── exportReact.js   # builds the React project ZIP
            └── exportHtml.jsx   # builds the plain HTML ZIP
```

---

## 4. Architecture

```mermaid
flowchart LR
  subgraph Browser["Browser — React app (Vite)"]
    P[Pages<br/>Home · Templates · Customize · SiteReady · MySites]
    T[Templates<br/>4 layouts × 3 pages]
    L[lib/api.js]
    X[Export<br/>JSZip]
    P --> T
    P --> L
    P --> X
  end
  subgraph Server["Express API (Node.js)"]
    R1[/categories/]
    R2[/templates/]
    R3[/sites/]
    R4[/sites/:id/messages/]
  end
  DB[(MongoDB Atlas<br/>categories · templates<br/>sites · messages)]
  L -- "fetch /api/..." --> Server
  Server -- Mongoose --> DB
  V[Visitor on a live or<br/>downloaded website] -- "POST /messages" --> R4
```

**Key idea:** a *template* stores the **design** (layout, colours, font, section texts, demo data);
a *site* stores only the **user's content**. When a website is shown, the two are merged and rendered by
one of 4 React layout components. That is why 45 templates need only 4 components.

---

## 5. How frontend and backend run together

### Development — two servers, one command
The root `package.json` uses **concurrently**:
```json
"dev": "concurrently -n api,web -c green,cyan \"npm run dev --prefix server\" \"npm run dev --prefix client\""
```

| Process | Command | Port |
| --- | --- | --- |
| `api` | `node --watch src/index.js` | 5000 |
| `web` | `vite` | 5173 |

The browser only talks to **5173**. `client/vite.config.js` forwards every `/api/...` request to Express:
```js
server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } }
```
```
Browser ──/api/templates──▶ Vite :5173 ──proxy──▶ Express :5000 ──▶ MongoDB
```
So the frontend code always calls relative URLs like `/api/templates` — no CORS problems and nothing to change for production.

### Production — one server
```bash
npm run build   # React → client/dist
npm start       # Express serves /api/* AND the files in client/dist
```
`server/src/app.js` serves `client/dist` and returns `index.html` for any other path, so React Router can
handle URLs like `/s/123/products` even after a page refresh.

---

## 6. Database

Four collections. `categories` and `templates` are platform data (written by the seed);
`sites` and `messages` are user data.

```mermaid
erDiagram
  CATEGORY ||--o{ TEMPLATE : "slug = template.category"
  TEMPLATE ||--o{ SITE : "template (ObjectId)"
  SITE ||--o{ MESSAGE : "site (ObjectId)"
```

### `categories` — `server/src/models/Category.js`
| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | "Mobile & Electronics Store" |
| `slug` | String, unique | "mobile-store" — used in URLs and by templates |
| `description`, `icon`, `cover` | String | card text, emoji, cover image URL |
| `order` | Number | display order |
| `group` | `'shop'` \| `'service'` | which section of the home page it appears in |

### `templates` — `server/src/models/Template.js`
| Field | Type | Notes |
| --- | --- | --- |
| `name`, `slug` | String | "Mobile Mart", "mobile-mart" |
| `category` | String | category slug |
| `layout` | `classic` \| `bold` \| `minimal` \| `dark` | which React component renders it |
| `theme` | `{ primary, accent, font }` | colours + Google font |
| `content` | `{ productsLabel, productsIntro, cta, features[] }` | fixed texts for the category |
| `demo` | `{ title, tagline, description, images[], products[], phone, email, address, hours }` | sample data shown in previews |
| `pages` | String[] | e.g. `["Home", "Products", "Contact"]` |
| `featured`, `tags`, `description` | | home page "Featured", search, card text |

### `sites` — `server/src/models/Site.js`
```js
{
  _id,
  template: ObjectId,                 // → templates
  data: {
    title, tagline, description,      // Basic info
    images: [String],                 // 3-4 base64 images
    products: [{ name, price, description, image }],   // 1-12
    phone, whatsapp, email, address, hours             // Contact
  },
  editKey: String,                    // secret; select:false → never returned by normal queries
  views: Number,                      // live website visits
  createdAt, updatedAt
}
```

### `messages` — `server/src/models/Message.js`
```js
{ _id, site: ObjectId /* → sites, indexed */, name, phone, email, message, read: Boolean, createdAt, updatedAt }
```

### Seed data and sync
- Categories and templates are defined in code: `server/src/seed/data.js` and `server/src/seed/shops.js`.
- `seed.js` **upserts** them by `slug` (update if it exists, insert if not).
- It runs **on every server start** (`syncSeed()` in `index.js`), so new categories, new templates and text
  changes appear after a restart. `sites` and `messages` are never touched.

### Images
Images are resized and compressed **in the browser** (`client/src/lib/image.js`, canvas → JPEG) — gallery
images to 1400 px, product images to 900 px — and stored as base64 strings inside the site document.
The server rejects anything that is not png/jpg/webp/gif or is larger than 3 MB.

---

## 7. Backend

### Startup flow — `server/src/index.js`
```mermaid
flowchart LR
  A[load .env] --> B[connectDB<br/>config/db.js]
  B --> C[syncSeed<br/>upsert 13 categories + 45 templates]
  C --> D[createApp<br/>app.js]
  D --> E[listen on PORT 5000]
  B -- error --> F[log + exit 1]
```

### Request flow — `server/src/app.js`
Middleware runs in this order for every request:

| # | Middleware | Purpose |
| --- | --- | --- |
| 1 | `cors()` | allow requests from any origin (downloaded websites run on other domains) |
| 2 | `express.json({ limit: '25mb' })` | JSON bodies (websites contain base64 images) |
| 3 | `express.urlencoded({ limit: '50kb' })` | normal HTML form posts (contact form without JavaScript) |
| 4 | `Cache-Control: no-store` on `/api` | API data is never cached (no 304 responses) |
| 5 | `GET /api/health` | health check |
| 6 | `/api/categories` → `routes/categories.js` | |
| 7 | `/api/templates` → `routes/templates.js` | |
| 8 | `/api/sites/:id/messages` → `routes/messages.js` | uses `Router({ mergeParams: true })` to read `:id` |
| 9 | `/api/sites` → `routes/sites.js` | |
| 10 | `/api/*` fallback | `404 { message: 'Route not found' }` |
| 11 | static `client/dist` + `index.html` fallback | production only (if the build exists) |
| 12 | error handler | `413` too large · `400` validation · `500` server error |

### Validation — `routes/sites.js` → `parse()`
| Field | Rule |
| --- | --- |
| `title` | required, max 80 |
| `tagline` | max 160 |
| `description` | required, max 1500 |
| `images` | at least 3, at most 4; png/jpg/webp/gif data URLs; each ≤ 3 MB |
| `products` | 1–12 items; `name` required (max 80), `price` max 40, `description` max 300, optional image (same image rules) |
| `phone` / `email` | at least one of them; `email` must be valid |
| `whatsapp`, `address`, `hours` | optional (30 / 250 / 120 chars) |

Every string is trimmed and cut to its max length. Errors return `400`:
```json
{ "message": "Please upload at least 3 images", "errors": { "images": "Please upload at least 3 images" } }
```

Contact messages (`routes/messages.js`): `name` required (80), `message` required (2000),
`phone` or `email` required, valid email; a hidden `company` field is a honeypot — if a bot fills it the
message is silently dropped.

### Owner authentication (no accounts)
1. `POST /api/sites` creates a random `editKey` (`crypto.randomBytes(16)`) and returns it **once**.
2. The browser stores it in `localStorage` (`sitecraft:editKeys` → `{ siteId: editKey }`).
3. Owner-only requests send it in the `x-edit-key` header.
4. `siteForOwner()` (exported from `routes/sites.js`) loads the site with `+editKey` and compares with
   `crypto.timingSafeEqual`; otherwise `403`.

---

## 8. API reference

Base URL: `/api` (development: proxied by Vite; production: same server).
All responses are JSON unless noted. 13 endpoints in total.

| # | Method | Endpoint | Access | File |
| --- | --- | --- | --- | --- |
| 1 | GET | `/api/health` | public | app.js |
| 2 | GET | `/api/categories` | public | categories.js |
| 3 | GET | `/api/categories/:slug` | public | categories.js |
| 4 | GET | `/api/templates` | public | templates.js |
| 5 | GET | `/api/templates/:id` | public | templates.js |
| 6 | POST | `/api/sites` | public | sites.js |
| 7 | GET | `/api/sites/:id` | public | sites.js |
| 8 | PUT | `/api/sites/:id` | **owner** | sites.js |
| 9 | POST | `/api/sites/:id/view` | public | sites.js |
| 10 | POST | `/api/sites/:id/messages` | public | messages.js |
| 11 | GET | `/api/sites/:id/messages` | **owner** | messages.js |
| 12 | PATCH | `/api/sites/:id/messages/:messageId` | **owner** | messages.js |
| 13 | DELETE | `/api/sites/:id/messages/:messageId` | **owner** | messages.js |

**Owner** = request header `x-edit-key: <editKey>`.

### Categories
**`GET /api/categories`** — all categories with a template count (MongoDB aggregation).
```json
[{ "_id": "...", "name": "Mobile & Electronics Store", "slug": "mobile-store", "icon": "📱",
   "group": "shop", "order": 2, "description": "...", "cover": "https://...", "templateCount": 4 }]
```
**`GET /api/categories/:slug`** — one category, `404` if missing.

### Templates
**`GET /api/templates?category=mobile-store&featured=true&q=dark`**
- `category` — category slug
- `featured=true` — only featured templates (home page)
- `q` — case-insensitive search in name, tags, description and category

Returns an array of template documents (featured first).

**`GET /api/templates/:id`** — by `_id` **or** `slug`.

### Websites
**`POST /api/sites`** — create a website
```json
// request
{
  "templateId": "675...",
  "data": {
    "title": "Patel Mobile Point",
    "tagline": "Trusted mobile store in Ahmedabad",
    "description": "New phones from every brand ...",
    "images": ["data:image/jpeg;base64,...", "...", "..."],
    "products": [{ "name": "Vivo V30 5G", "price": "₹33,999", "description": "12GB RAM", "image": "data:image/jpeg;base64,..." }],
    "phone": "+91 98250 12345", "whatsapp": "919825012345",
    "email": "patel@mobile.com", "address": "CG Road, Ahmedabad", "hours": "Daily 10 AM - 10 PM"
  }
}
// 201 response
{ "_id": "676...", "editKey": "9f1c...e2" }
```

**`GET /api/sites/:id`** — the website with its template populated:
```json
{ "_id": "676...", "template": { /* full template */ }, "data": { /* as above */ }, "views": 12, "createdAt": "...", "updatedAt": "..." }
```

**`PUT /api/sites/:id`** (owner) — same body as POST. `templateId` may change the template. Returns `{ "_id": "..." }`.

**`POST /api/sites/:id/view`** — increments `views`. Returns `204`. Called once when the live website opens.

### Messages
**`POST /api/sites/:id/messages`** — a visitor sends a message. Accepts **JSON** or **form-urlencoded**.
```json
// request
{ "name": "Rahul Shah", "phone": "9876500000", "email": "rahul@test.com", "message": "Is the Vivo V30 available?", "company": "" }
// 201 response (JSON request)
{ "ok": true, "message": "Your message has been sent",
  "data": { "_id": "677...", "site": "676...", "name": "Rahul Shah", "createdAt": "2026-11-28T09:32:00.000Z" } }
```
For a form-urlencoded request (HTML form without JavaScript) it returns a small "Thank you!" HTML page with a "Go back" link.

**`GET /api/sites/:id/messages`** (owner) — newest first.
```json
[{ "_id": "677...", "site": "676...", "name": "Rahul Shah", "phone": "9876500000", "email": "rahul@test.com",
   "message": "Is the Vivo V30 available?", "read": false, "createdAt": "..." }]
```

**`PATCH /api/sites/:id/messages/:messageId`** (owner) — body `{ "read": true }`, returns the updated message.

**`DELETE /api/sites/:id/messages/:messageId`** (owner) — returns `204`.

### Errors
| Status | When |
| --- | --- |
| 400 | validation failed (`{ message, errors }`) |
| 403 | missing or wrong `x-edit-key` |
| 404 | site / template / category / message not found, or unknown `/api` route |
| 413 | body too large |
| 500 | unexpected server error |

### Try it with curl
```bash
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/templates?category=mobile-store"
curl -X POST http://localhost:5000/api/sites/<siteId>/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"9999999999","message":"Hello"}'
curl http://localhost:5000/api/sites/<siteId>/messages -H "x-edit-key: <editKey>"
```

---

## 9. Frontend

### Routes — `client/src/App.jsx`
| Path | Page | Purpose |
| --- | --- | --- |
| `/` | `Home.jsx` | hero + search, categories (Shops / Services), featured templates, how it works |
| `/templates` | `Templates.jsx` | all templates, category chips, search (`?category=&q=`) |
| `/category/:slug` | `CategoryPage.jsx` | the 3–4 templates of one category |
| `/template/:id` | `TemplatePreview.jsx` | full preview: page tabs (Home/Products/Contact) + device toggle |
| `/customize/:id` | `Customize.jsx` | the 4-step builder form + live preview. `?site=<id>` = edit mode |
| `/site/:id` | `SiteReady.jsx` | "Your website is ready": link, downloads, edit, **Messages inbox**, preview |
| `/my-sites` | `MySites.jsx` | websites created in this browser |
| `/s/:id` and `/s/:id/:page` | `LiveSite.jsx` | the **published website** (no platform navbar/footer) |
| `*` | `NotFound.jsx` | 404 |

`App.jsx` also scrolls to the top on page change (or to `#section` for hash links) and hides the platform
Navbar/Footer on `/s/*`.

### Components — `client/src/components/`
| Component | Used by | What it does |
| --- | --- | --- |
| `Navbar`, `Footer`, `Logo` | App | platform header (with mobile menu) and footer |
| `CategoryCard` | Home | category tile with cover image and template count |
| `TemplateCard` | Home, Templates, CategoryPage | live mini-preview of a template + "Use" button |
| `ScaledFrame` | everywhere a template is previewed | renders content at a virtual width (e.g. 1280px) and scales it down |
| `DeviceToggle` | TemplatePreview, Customize | desktop 1280 / tablet 768 / mobile 390 |
| `PageTabs` | TemplatePreview, Customize, SiteReady | Home / Products / Contact tabs |
| `Steps` | CategoryPage, Customize, SiteReady | progress: Category → Template → Details → Website ready |
| `MessagesInbox` | SiteReady | owner's list of messages: refresh, mark read/unread, delete |
| `States` | many | `Spinner`, `PageLoader`, `ErrorState`, `SkeletonGrid` |

### Helpers — `client/src/lib/`
| File | What it does |
| --- | --- |
| `api.js` | `API_BASE`, every API call (`api.categories()`, `api.createSite()`, `api.messages()` …) and `editKeys` (get / set / ids / remove in `localStorage`) |
| `useFetch.js` | `useFetch(fn, deps)` → `{ data, loading, error }`, ignores results after unmount |
| `image.js` | `compressImage(file, maxSize, quality)` → base64 JPEG via `<canvas>` |
| `exportReact.js` | builds the React project ZIP (section 12) |
| `exportHtml.jsx` | builds the plain HTML ZIP (section 12) |

Both export files are loaded with dynamic `import()` only when the user clicks download, so they do not
slow down the first page load.

### The builder form — `pages/Customize.jsx`
| Step | Fields | Preview shows |
| --- | --- | --- |
| 📝 Basic info | title*, tagline, description* | Home |
| 🖼️ Images | 4 slots (3 required): upload, multi-select, drag & drop, change, remove, "Make main" | Home |
| 🛍️ Products | 1–12 items: image, name*, price, description; reorder ↑↓; delete | Products |
| 📞 Contact | phone, WhatsApp, email, address, business hours (phone or email required) | Contact |

- The preview on the right updates on every keystroke. Empty fields show the template's demo content.
- Validation runs on submit; steps with errors get a red dot and the form jumps to the first one.
- **Create mode** (`/customize/:templateId`): `POST /api/sites` → saves `editKey` → goes to `/site/:id`.
- **Edit mode** (`/customize/:templateId?site=:siteId`): loads the site, fills every field, `PUT /api/sites/:id`.
  If this browser has no edit key for the site, an explanation is shown instead.
- On phones a floating button switches between the form and the preview.

---

## 10. The template system

### Files
```
templates/
├── index.jsx          # TemplateRenderer + the layouts map
├── shared.jsx         # everything the layouts share
├── ClassicLayout.jsx  # light, split hero, rounded cards
├── BoldLayout.jsx     # full-bleed image heroes, uppercase type
├── MinimalLayout.jsx  # spacious, serif, hairline dividers
└── DarkLayout.jsx     # dark theme, glow, glass cards
```
Each layout file contains a Header, Footer and three page components — **Home**, **Products**, **Contact** —
and a default export `Layout({ template, data, page, fab })` that picks the page.

### Rendering a template
```jsx
<TemplateRenderer
  template={template}     // from the templates collection
  data={userData}         // the user's data (or nothing for a demo preview)
  page="home"             // 'home' | 'products' | 'contact'
  nav={{ mode: 'router', base: '/s/123', siteId: '123', apiBase: '' }}
  strict                  // true = only the user's data, false = demo data fills empty fields
/>
```
`TemplateRenderer` → `mergeData(template, data, strict)` → `layouts[template.layout]` → page.

### `mergeData` (in `shared.jsx`)
| | `strict = false` (previews) | `strict = true` (final website) |
| --- | --- | --- |
| Empty text field | demo value | empty (hidden) |
| Images | user's images, rest from demo (4 total) | only user's images |
| No products yet | demo products | — (at least 1 is required) |
| Product without image | demo product image | one of the user's gallery images |

### One template, four places — `SiteNavContext`
The same components run in four places. Links and the contact form behave differently in each, so the
template reads a React context instead of knowing where it is:

| Place | `nav.mode` | Links | Contact form |
| --- | --- | --- | --- |
| Builder / template preview | `preview` | change the preview tab (`nav.go(page)`) | sends only if `nav.siteId` exists (saved website), then calls `nav.onMessageSent` |
| Live website `/s/:id` | `router` | React Router `<Link>` to `/s/:id/products` | `fetch` POST to the API |
| Downloaded React project | `router` (base `''`) | `<Link to="/products">` | `fetch` POST to the API |
| Downloaded HTML | `static` | `<a href="products.html">` | inline script sends with `fetch`; plain form post without JavaScript |

### Responsive previews — container queries
A template shown in a 400 px card must still use its desktop layout. Normal media queries look at the
browser width, so the templates use Tailwind **container queries** instead: the root element has
`@container` and classes like `@3xl:grid-cols-2` respond to the template's own width. `ScaledFrame` renders
the template at a virtual width (1280 / 768 / 390) and shrinks it with `transform: scale()`.

### Other shared pieces (`shared.jsx`)
`SiteLink`, `navItems`, `contactList` (hides empty fields), `enquireHref` (WhatsApp → call → email),
`ContactForm`, `MapEmbed` (Google Maps iframe), `WhatsAppFab`, `Icon`, `hexToRgba`, `pic(data, i)`.

---

## 11. End-to-end flows

### A. Browse and choose a template
```mermaid
sequenceDiagram
  actor U as User
  participant FE as React app
  participant API as Express
  participant DB as MongoDB
  U->>FE: open /
  FE->>API: GET /api/categories, GET /api/templates?featured=true
  API->>DB: Category.find + Template.aggregate (counts) / Template.find
  API-->>FE: categories, featured templates
  U->>FE: click "Mobile & Electronics Store"
  FE->>API: GET /api/categories/mobile-store, GET /api/templates?category=mobile-store
  API-->>FE: category + 4 templates (rendered as live mini-previews)
  U->>FE: open a template → /template/:id (tabs + device toggle)
  U->>FE: "Use this template" → /customize/:id
```

### B. Create a website
```mermaid
sequenceDiagram
  actor U as User
  participant FE as Customize.jsx
  participant API as POST /api/sites
  participant DB as MongoDB
  U->>FE: fill 4 steps (images compressed in the browser)
  FE->>FE: validate() — jump to first step with errors
  FE->>API: { templateId, data }
  API->>API: parse() — clean + validate
  API->>DB: Site.create (editKey generated)
  API-->>FE: 201 { _id, editKey }
  FE->>FE: localStorage editKeys[_id] = editKey
  FE-->>U: navigate to /site/:id ("Your website is ready")
```

### C. A visitor opens the live website
```mermaid
sequenceDiagram
  actor V as Visitor
  participant FE as LiveSite.jsx
  participant API as Express
  V->>FE: /s/:id (or /s/:id/products, /s/:id/contact)
  FE->>API: GET /api/sites/:id
  FE->>API: POST /api/sites/:id/view (views + 1)
  API-->>FE: site + populated template
  FE-->>V: TemplateRenderer (strict, mode "router") — no platform navbar
  V->>FE: "Enquire now" on a product → WhatsApp with a pre-filled message
```

### D. A visitor sends a contact message
```mermaid
sequenceDiagram
  actor V as Visitor
  participant F as ContactForm (shared.jsx)
  participant API as POST /api/sites/:id/messages
  participant DB as MongoDB
  V->>F: name, phone, email, message → "Send message"
  F->>API: fetch POST (JSON)
  API->>API: site exists? honeypot? validate
  API->>DB: Message.create
  API-->>F: 201 { ok, message, data: { _id, createdAt } }
  F-->>V: "✅ Thank you! Your message has been sent."
```
This works from the live website, the downloaded React project, the downloaded HTML website and the preview
on the "Website ready" page. In DevTools it appears as **Network → Fetch/XHR → `messages`, POST, 201**.

### E. The owner reads messages
`/site/:id` → `MessagesInbox` → `GET /api/sites/:id/messages` with `x-edit-key` → list, newest first (unread
messages are highlighted and counted as "new") → **Mark as read** (`PATCH`) / **Delete** (`DELETE`) / **Refresh**. A message sent from the preview on
the same page reloads the inbox automatically.

### F. Edit a website
`My Websites` or `/site/:id` → **Edit** → `/customize/:templateId?site=:id` → `GET /api/sites/:id` → every
field (text, images, products with images, contact) is filled → change → **Save changes** → `PUT /api/sites/:id`
with `x-edit-key` → back to `/site/:id`.

### G. My Websites
`MySites.jsx` reads all ids from `localStorage` (`editKeys.ids()`), loads each with `GET /api/sites/:id`
(`Promise.allSettled`), and shows them newest first with Dashboard, Edit, View and Remove (removes it from
this list only — the website stays online).

---

## 12. Downloads (React project and HTML)

Both ZIPs are built **in the browser** with JSZip — the server does no extra work.

### React project (main download) — `lib/exportReact.js`
```
patel-mobile-point/
├── package.json            # react, react-dom, react-router-dom, vite, tailwind
├── vite.config.js
├── index.html              # only <div id="root">
├── README.md               # how to run, build and edit
├── vercel.json             # SPA rewrites for Vercel
├── public/
│   ├── _redirects          # SPA rewrites for Netlify
│   └── images/             # photo-1.jpg … product-1.jpg (decoded from base64)
└── src/
    ├── main.jsx            # BrowserRouter
    ├── App.jsx             # routes /, /products, /contact
    ├── config.js           # siteId + apiUrl for the contact form
    ├── data/site.json      # ⭐ the user's content
    ├── data/template.json  # layout, theme, section texts
    └── templates/
        ├── <Chosen>Layout.jsx
        └── shared.jsx
```
- The template source is the **same code the builder uses**, included at build time with Vite `?raw` imports.
- Only the chosen layout is included.
- Run it: `npm install` → `npm run dev`. Build for hosting: `npm run build` → upload `dist/`.
- Editing `src/data/site.json` changes the website instantly in dev mode.

### Plain HTML — `lib/exportHtml.jsx`
`index.html`, `products.html`, `contact.html`, `style.css` (the app's compiled Tailwind CSS) and `images/`.
Pages are rendered with `renderToStaticMarkup`. The contact page includes a small script that sends the form
with `fetch`.

> The contact form of a downloaded website sends messages to the API it was downloaded from
> (`window.location.origin` or `VITE_API_URL`). Download from the deployed platform, not from `localhost`,
> if the website will be hosted publicly.

---

## 13. How to extend the project

| Task | Where |
| --- | --- |
| **New template** (new colours of an existing layout) | add a line to `plan` in `server/src/seed/data.js` or `shopPlan` in `shops.js`: `['slug', 'Name', 'classic', '#primary', '#accent', 'Font', featured, ['tags']]` → restart the server |
| **New shop category** | add one entry to each of `shopCategories`, `shopContent`, `shopDemo`, `shopPlan` in `server/src/seed/shops.js` → restart |
| **New service category** | same in `server/src/seed/data.js` (`baseCategories`, `content`, `demo`, `plan`) |
| **New layout** | create `client/src/templates/NewLayout.jsx` (Home / Products / Contact + header/footer), register it in `layouts` in `templates/index.jsx`, add it to the `layout` enum in `server/src/models/Template.js`, and add it to `LAYOUTS` in `lib/exportReact.js` |
| **New website field** (e.g. Instagram link) | `Site.js` schema → `parse()` in `routes/sites.js` → `emptyForm` + an input in `Customize.jsx` → `mergeData` keys in `shared.jsx` → use it in the layouts |
| **New font** | add it to the Google Fonts URL in `client/index.html` and `FONTS` in both export files |

---

## 14. Deployment

### One service (recommended) — Render / Railway
| Setting | Value |
| --- | --- |
| Root directory | `sitecraft` |
| Build command | `npm run install-all && npm run build` |
| Start command | `npm start` |
| Environment | `MONGODB_URI`, (optional) `PORT` |

Express serves the API and the React build from one URL.

### Separate frontend (e.g. Vercel) + backend (Render)
- Backend as above (without the build step).
- Frontend: build `client/`, set `VITE_API_URL=https://your-api.onrender.com`, and add an SPA rewrite to `index.html`.

### MongoDB Atlas in production
Allow the hosting provider's IPs (or `0.0.0.0/0`) under **Network Access**.

---

## 15. Security

| Measure | Where |
| --- | --- |
| Owner-only endpoints require `x-edit-key` | `siteForOwner()` in `routes/sites.js` |
| Edit key: 128-bit random, compared with `crypto.timingSafeEqual`, `select: false` in the schema | `models/Site.js`, `routes/sites.js` |
| All inputs trimmed and length-limited; email format checked | `parse()`, `routes/messages.js` |
| Image whitelist (png/jpg/webp/gif) and 3 MB limit; body limits 25 MB (JSON) / 50 KB (forms) | `routes/sites.js`, `app.js` |
| Honeypot field against spam bots | `ContactForm`, `routes/messages.js` |
| HTML escaping in server-rendered "Thank you" page and exported HTML | `routes/messages.js`, export files |
| Secrets only in `server/.env` (git-ignored) | `.gitignore` |

---

## 16. Limitations and roadmap

| Current limitation | Planned improvement |
| --- | --- |
| No user accounts — a website can only be edited from the browser that created it | JWT login, websites linked to accounts |
| Images stored as base64 in MongoDB (16 MB document limit) | Upload to Cloudinary / S3, store URLs |
| No rate limiting on the public message endpoint | `express-rate-limit` |
| Owner is not notified of new messages | Email notifications (Nodemailer) |
| No automated test suite in the repo | Jest + Supertest for the API, React Testing Library for the UI |
| No online payments / orders | Razorpay for product orders and bookings |
| No custom domains | Map a domain (e.g. `patelmobile.com`) to a website |

---

## 17. Troubleshooting

| Problem | Fix |
| --- | --- |
| `MONGODB_URI is missing` | create `server/.env` from `.env.example` |
| `MongoServerError: bad auth` / timeout | check the user/password in the URI and Atlas **Network Access** |
| Data is not visible in Atlas | look in the database named in the URI — without a name it is `test` |
| New categories/templates or text changes do not show | restart the server (seed sync runs on start), then hard-refresh the browser (`Ctrl + Shift + R`) |
| Port 5000 or 5173 already in use | stop the other process or change `PORT` / the Vite port |
| "You cannot edit this website here" | the edit key is stored only in the browser that created the website |
| Contact message not visible in DevTools | open **Network → Fetch/XHR**, tick **Preserve log**, send the form, look for `messages` (POST, 201). The preview of a website that is not generated yet does not send messages |
| Downloaded website's contact form fails | the API it points to must be running and reachable (see `src/config.js` in the React project) |
| `/products` gives 404 after refresh on hosting | use the included `_redirects` (Netlify) / `vercel.json` (Vercel), or configure an SPA fallback |
