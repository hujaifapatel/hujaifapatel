import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, editKeys } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { compressImage } from '../lib/image.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import DeviceToggle, { devices } from '../components/DeviceToggle.jsx';
import PageTabs from '../components/PageTabs.jsx';
import Steps from '../components/Steps.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader, Spinner } from '../components/States.jsx';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_IMAGES = 3;
const MAX_IMAGES = 4;
const MAX_PRODUCTS = 8;
const IMAGE_SLOTS = ['Main / Hero image', 'About section', 'Gallery', 'Gallery / Contact'];

const emptyProduct = () => ({ name: '', price: '', description: '', image: '' });
const emptyForm = () => ({
  title: '', tagline: '', description: '',
  images: Array(MAX_IMAGES).fill(''),
  products: [emptyProduct()],
  phone: '', whatsapp: '', email: '', address: '', hours: '',
});

const input =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

// Form ke 4 steps; har step preview me kaunsa page dikhaye
const STEPS = [
  { key: 'basic', label: 'Basic info', icon: '📝', page: 'home' },
  { key: 'images', label: 'Images', icon: '🖼️', page: 'home' },
  { key: 'products', label: 'Products', icon: '🛍️', page: 'products' },
  { key: 'contact', label: 'Contact', icon: '📞', page: 'contact' },
];

function validate(form) {
  const e = {};
  if (!form.title.trim()) e.title = 'Website ka title / business name daalein';
  if (!form.description.trim()) e.description = 'Apne business ke baare me thoda likhiye';
  if (form.images.filter(Boolean).length < MIN_IMAGES) e.images = `Kam se kam ${MIN_IMAGES} images upload karein`;
  const named = form.products.filter((p) => p.name.trim());
  if (!named.length) e.products = 'Kam se kam 1 product / service add karein (naam ke saath)';
  form.products.forEach((p, i) => {
    if (!p.name.trim() && (p.price || p.description || p.image)) e[`product-${i}`] = 'Naam zaroori hai';
  });
  if (!form.phone.trim() && !form.email.trim()) e.contact = 'Phone ya email me se kam se kam ek daalein';
  if (form.email && !EMAIL_RX.test(form.email.trim())) e.email = 'Email sahi format me daalein';
  if (form.phone && form.phone.replace(/\D/g, '').length < 7) e.phone = 'Phone number sahi daalein';
  return e;
}

const stepOf = (errKey) =>
  ['title', 'description'].includes(errKey) ? 'basic'
    : errKey === 'images' ? 'images'
    : errKey.startsWith('product') ? 'products'
    : 'contact';

/* ---------------------------- Step: Images ---------------------------- */
function ImagesStep({ images, setImages, error }) {
  const multiRef = useRef(null);
  const slotRefs = useRef([]);
  const [busy, setBusy] = useState(-1);
  const [err, setErr] = useState('');

  const putAt = async (index, file) => {
    if (!file) return;
    setBusy(index);
    setErr('');
    try {
      const src = await compressImage(file);
      setImages((imgs) => imgs.map((s, i) => (i === index ? src : s)));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(-1);
    }
  };

  // Ek saath multiple images select karein -> khali slots me bhar jaayengi
  const addMany = async (fileList) => {
    const files = Array.from(fileList || []);
    let free = images.map((s, i) => (s ? -1 : i)).filter((i) => i >= 0);
    if (!free.length) free = [0, 1, 2, 3];
    for (const [n, file] of files.slice(0, free.length).entries()) await putAt(free[n], file);
  };

  const remove = (index) => setImages((imgs) => imgs.map((s, i) => (i === index ? '' : s)));
  const makeMain = (index) =>
    setImages((imgs) => {
      const next = [...imgs];
      [next[0], next[index]] = [next[index], next[0]];
      return next;
    });

  const count = images.filter(Boolean).length;
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{MIN_IMAGES}–{MAX_IMAGES} images upload karein ({count}/{MAX_IMAGES})</p>
        <button type="button" onClick={() => multiRef.current?.click()} className="text-sm font-semibold text-brand-600 hover:text-brand-700">+ Select multiple</button>
        <input ref={multiRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addMany(e.target.files); e.target.value = ''; }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {images.map((src, i) => (
          <div key={i}>
            <div
              onClick={() => !src && slotRefs.current[i]?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); putAt(i, e.dataTransfer.files?.[0]); }}
              className={`group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
                src ? 'border-transparent' : 'cursor-pointer border-slate-200 hover:border-brand-500 hover:bg-brand-50/50'
              } ${error && !src && i < MIN_IMAGES ? 'border-red-300 bg-red-50' : ''}`}
            >
              {busy === i ? (
                <Spinner className="h-6 w-6" />
              ) : src ? (
                <>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1.5 bg-ink/60 p-2 opacity-0 transition group-hover:opacity-100">
                    <button type="button" onClick={() => slotRefs.current[i]?.click()} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink">Change</button>
                    {i > 0 && <button type="button" onClick={() => makeMain(i)} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink">Make main</button>}
                    <button type="button" onClick={() => remove(i)} className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">Remove</button>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <div className="text-2xl">＋</div>
                  <div className="mt-1 text-xs">{i < MIN_IMAGES ? 'Required' : 'Optional'}</div>
                </div>
              )}
              <input ref={(el) => (slotRefs.current[i] = el)} type="file" accept="image/*" hidden onChange={(e) => { putAt(i, e.target.files?.[0]); e.target.value = ''; }} />
            </div>
            <div className="mt-1 truncate text-xs text-slate-500">{i + 1}. {IMAGE_SLOTS[i]}</div>
          </div>
        ))}
      </div>
      {(error || err) && <p className="mt-2 text-xs text-red-600">{err || error}</p>}
      <p className="mt-3 text-xs text-slate-400">Tip: Image par hover karke "Make main" se hero image badal sakte hain. Images auto-compress hongi.</p>
    </div>
  );
}

/* --------------------------- Step: Products --------------------------- */
function ProductsStep({ template, products, setProducts, errors }) {
  const fileRefs = useRef([]);
  const [busy, setBusy] = useState(-1);
  const label = template.content.productsLabel || 'Products';

  const update = (i, k, v) => setProducts((ps) => ps.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const onImage = async (i, file) => {
    if (!file) return;
    setBusy(i);
    try {
      update(i, 'image', await compressImage(file, 900, 0.8));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(-1);
    }
  };
  const move = (i, dir) =>
    setProducts((ps) => {
      const next = [...ps];
      const j = i + dir;
      if (j < 0 || j >= next.length) return ps;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <p className="text-sm text-slate-500">
        Aapke <strong>{label}</strong> page par ye items dikhenge (max {MAX_PRODUCTS}). Image nahi daali to aapki gallery image use hogi.
      </p>
      {errors.products && <p className="mt-2 text-xs text-red-600">{errors.products}</p>}
      <div className="mt-4 space-y-3">
        {products.map((p, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileRefs.current[i]?.click()}
                className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-brand-500"
                title="Product image"
              >
                {busy === i ? <Spinner className="h-5 w-5" /> : p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <span className="text-xs">+ Image</span>}
              </button>
              <input ref={(el) => (fileRefs.current[i] = el)} type="file" accept="image/*" hidden onChange={(e) => { onImage(i, e.target.files?.[0]); e.target.value = ''; }} />
              <div className="min-w-0 flex-1 space-y-2">
                <input className={`${input} py-2`} placeholder={`Naam (e.g. ${template.demo.products?.[i % 4]?.name || 'Item name'})`} value={p.name} onChange={(e) => update(i, 'name', e.target.value)} maxLength={80} />
                <input className={`${input} py-2`} placeholder="Price (e.g. ₹499)" value={p.price} onChange={(e) => update(i, 'price', e.target.value)} maxLength={40} />
              </div>
            </div>
            <textarea className={`${input} mt-2 resize-none py-2`} rows={2} placeholder="Short description" value={p.description} onChange={(e) => update(i, 'description', e.target.value)} maxLength={300} />
            {errors[`product-${i}`] && <p className="mt-1 text-xs text-red-600">{errors[`product-${i}`]}</p>}
            <div className="mt-2 flex items-center justify-between text-xs">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === products.length - 1} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30">↓</button>
                {p.image && <button type="button" onClick={() => update(i, 'image', '')} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">Remove image</button>}
              </div>
              <button type="button" onClick={() => setProducts((ps) => ps.filter((_, j) => j !== i))} className="rounded px-2 py-1 font-medium text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {products.length < MAX_PRODUCTS && (
        <button type="button" onClick={() => setProducts((ps) => [...ps, emptyProduct()])} className="mt-3 w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 hover:border-brand-500 hover:text-brand-600">
          + Add {label.toLowerCase().replace(/s$/, '')}
        </button>
      )}
    </div>
  );
}

/* ------------------------------ Page ------------------------------ */
export default function Customize() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const editId = params.get('site');
  const editKey = editId ? editKeys.get(editId) : null;
  const navigate = useNavigate();

  const { data: t, loading, error } = useFetch(() => api.template(id), [id]);
  const existing = useFetch(() => (editId && editKey ? api.site(editId) : Promise.resolve(null)), [editId]);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [page, setPage] = useState('home');
  const [device, setDevice] = useState(() => (window.innerWidth < 640 ? 'mobile' : 'desktop'));
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPreview, setShowPreview] = useState(false); // mobile par preview toggle

  // Edit mode: purana data form me bharo
  useEffect(() => {
    const d = existing.data?.data;
    if (!d) return;
    setForm({
      ...emptyForm(),
      ...d,
      images: [...(d.images || []), '', '', '', ''].slice(0, MAX_IMAGES),
      products: d.products?.length ? d.products.map((p) => ({ ...emptyProduct(), ...p })) : [emptyProduct()],
    });
  }, [existing.data]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined, contact: undefined }));
  };
  const setImages = (fn) => {
    setForm((f) => ({ ...f, images: typeof fn === 'function' ? fn(f.images) : fn }));
    setErrors((er) => ({ ...er, images: undefined }));
  };
  const setProducts = (fn) => {
    setForm((f) => ({ ...f, products: typeof fn === 'function' ? fn(f.products) : fn }));
    setErrors((er) => Object.fromEntries(Object.entries(er).filter(([k]) => !k.startsWith('product'))));
  };

  const goStep = (i) => {
    setStep(i);
    setPage(STEPS[i].page);
  };

  // Preview ke liye data (khali images hata kar)
  const previewData = useMemo(() => ({ ...form, images: form.images.filter(Boolean) }), [form]);
  const errorSteps = new Set(Object.keys(errors).filter((k) => errors[k]).map(stepOf));

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    const keys = Object.keys(v);
    if (keys.length) {
      goStep(STEPS.findIndex((s) => s.key === stepOf(keys[0])));
      return;
    }
    setSaving(true);
    setServerError('');
    try {
      const data = {
        ...Object.fromEntries(['title', 'tagline', 'description', 'phone', 'whatsapp', 'email', 'address', 'hours'].map((k) => [k, form[k].trim()])),
        images: form.images.filter(Boolean),
        products: form.products.filter((p) => p.name.trim()),
      };
      if (editId && editKey) {
        await api.updateSite(editId, { templateId: t._id, data }, editKey);
        navigate(`/site/${editId}`);
      } else {
        const site = await api.createSite({ templateId: t._id, data });
        editKeys.set(site._id, site.editKey);
        navigate(`/site/${site._id}`);
      }
    } catch (err) {
      setServerError(err.message);
      if (err.errors) setErrors(err.errors);
    } finally {
      setSaving(false);
    }
  };

  if (loading || existing.loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Template nahi mila" />;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step].key;

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to={`/template/${t._id}`} className="text-sm text-slate-500 hover:text-ink">← Back to preview</Link>
            <h1 className="mt-1 text-2xl font-bold">{editId ? 'Edit your website' : `Customize “${t.name}”`}</h1>
          </div>
          <Steps current={2} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[440px_1fr]">
          {/* FORM */}
          <form onSubmit={onSubmit} noValidate className={`h-fit rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24 ${showPreview ? 'hidden lg:block' : ''}`}>
            <div className="grid grid-cols-4 border-b border-slate-100">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => goStep(i)}
                  className={`relative flex flex-col items-center gap-1 px-1 py-3 text-xs font-medium transition ${
                    step === i ? 'text-brand-700' : 'text-slate-500 hover:text-ink'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  {s.label}
                  {errorSteps.has(s.key) && <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-red-500" />}
                  {step === i && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500" />}
                </button>
              ))}
            </div>

            <div className="max-h-none space-y-5 p-6 lg:max-h-[calc(100vh-17rem)] lg:overflow-y-auto">
              {current === 'basic' && (
                <>
                  <Field label="Website title / Business name *" error={errors.title}>
                    <input className={input} value={form.title} onChange={set('title')} placeholder={t.demo.title} maxLength={80} />
                  </Field>
                  <Field label="Tagline" hint="Ek chhoti si line jo aapke business ko describe kare">
                    <input className={input} value={form.tagline} onChange={set('tagline')} placeholder={t.demo.tagline} maxLength={160} />
                  </Field>
                  <Field label="Description / About *" error={errors.description} hint={`${form.description.length}/1500 — Home page ke "About" section me dikhega`}>
                    <textarea className={`${input} resize-y`} rows={6} value={form.description} onChange={set('description')} placeholder={t.demo.description} maxLength={1500} />
                  </Field>
                </>
              )}

              {current === 'images' && <ImagesStep images={form.images} setImages={setImages} error={errors.images} />}

              {current === 'products' && <ProductsStep template={t} products={form.products} setProducts={setProducts} errors={errors} />}

              {current === 'contact' && (
                <>
                  {errors.contact && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errors.contact}</p>}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone" error={errors.phone}>
                      <input className={input} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                    </Field>
                    <Field label="WhatsApp" hint="Chat button + enquiry">
                      <input className={input} type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="919876543210" />
                    </Field>
                  </div>
                  <Field label="Email" error={errors.email} hint="Contact form ke messages yahan aayenge">
                    <input className={input} type="email" value={form.email} onChange={set('email')} placeholder="you@business.com" />
                  </Field>
                  <Field label="Address" hint="Contact page par Google Map me dikhega">
                    <textarea className={`${input} resize-none`} rows={2} value={form.address} onChange={set('address')} placeholder="Shop no, area, city" maxLength={250} />
                  </Field>
                  <Field label="Business hours">
                    <input className={input} value={form.hours} onChange={set('hours')} placeholder={t.demo.hours} maxLength={120} />
                  </Field>
                </>
              )}
            </div>

            <div className="space-y-3 border-t border-slate-100 p-6">
              {serverError && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}
              <div className="flex gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => goStep(step - 1)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">Back</button>
                )}
                {isLast ? (
                  <button disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-60">
                    {saving && <Spinner className="h-4 w-4 border-2 border-white/40 border-t-white" />}
                    {saving ? 'Saving...' : editId ? 'Save changes' : 'Generate my website 🚀'}
                  </button>
                ) : (
                  <button type="button" onClick={() => goStep(step + 1)} className="flex-1 rounded-xl bg-ink py-3 font-semibold text-white hover:bg-slate-800">
                    Next: {STEPS[step + 1].label} →
                  </button>
                )}
              </div>
              {!isLast && (
                <button type="submit" disabled={saving} className="w-full text-center text-xs font-medium text-slate-400 hover:text-brand-600">
                  Sab bhar diya? Seedha website generate karein →
                </button>
              )}
            </div>
          </form>

          {/* LIVE PREVIEW */}
          <div className={`min-w-0 ${showPreview ? '' : 'hidden lg:block'}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
                  Live preview
                </span>
                <PageTabs template={t} value={page} onChange={setPage} />
              </div>
              <DeviceToggle value={device} onChange={setDevice} />
            </div>
            <div className="mx-auto overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200" style={{ maxWidth: devices[device].width }}>
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3 truncate rounded bg-white px-3 py-0.5 text-xs text-slate-400 ring-1 ring-slate-200">
                  {(form.title || t.demo.title).toLowerCase().replace(/[^a-z0-9]+/g, '')}.sitecraft.app/{page === 'home' ? '' : page}
                </span>
              </div>
              <ScaledFrame key={device} width={devices[device].width} height={760} scrollable resetKey={page}>
                <TemplateRenderer template={t} data={previewData} page={page} nav={{ mode: 'preview', go: setPage }} />
              </ScaledFrame>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Khali fields me demo content dikh raha hai — final website me sirf aapka data hoga.</p>
          </div>
        </div>
      </div>

      {/* Mobile: form <-> preview switch */}
      <button
        type="button"
        onClick={() => setShowPreview((s) => !s)}
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-2xl lg:hidden"
      >
        {showPreview ? '✏️ Back to form' : '👀 Show preview'}
      </button>
    </main>
  );
}
