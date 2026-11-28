import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { compressImage } from '../lib/image.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import DeviceToggle, { devices } from '../components/DeviceToggle.jsx';
import Steps from '../components/Steps.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader, Spinner } from '../components/States.jsx';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

const input =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10';

export default function Customize() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { data: t, loading, error } = useFetch(() => api.template(id), [id]);

  const [form, setForm] = useState({ title: '', tagline: '', image: '', phone: '', email: '', address: '', whatsapp: '' });
  const [errors, setErrors] = useState({});
  const [imgBusy, setImgBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [device, setDevice] = useState('desktop');

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined, contact: undefined }));
  };

  const onImage = async (file) => {
    if (!file) return;
    setImgBusy(true);
    try {
      const image = await compressImage(file);
      setForm((f) => ({ ...f, image }));
      setErrors((er) => ({ ...er, image: undefined }));
    } catch (e) {
      setErrors((er) => ({ ...er, image: e.message }));
    } finally {
      setImgBusy(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Website ka title / business name daalein';
    if (!form.image) e.image = 'Ek image upload karein';
    if (!form.phone.trim() && !form.email.trim()) e.contact = 'Phone ya email me se kam se kam ek daalein';
    if (form.email && !EMAIL_RX.test(form.email.trim())) e.email = 'Email sahi format me daalein';
    if (form.phone && form.phone.replace(/\D/g, '').length < 7) e.phone = 'Phone number sahi daalein';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setSaving(true);
    setServerError('');
    try {
      const data = Object.fromEntries(Object.entries(form).map(([k, val]) => [k, val.trim()]));
      const site = await api.createSite({ templateId: t._id, data });
      navigate(`/site/${site._id}`);
    } catch (err) {
      setServerError(err.message);
      if (err.errors) setErrors(err.errors);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Template nahi mila" />;

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to={`/template/${t._id}`} className="text-sm text-slate-500 hover:text-ink">← Back to preview</Link>
            <h1 className="mt-1 text-2xl font-bold">Customize “{t.name}”</h1>
          </div>
          <Steps current={2} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* FORM */}
          <form onSubmit={onSubmit} className="h-fit space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24" noValidate>
            <div>
              <span className="text-sm font-medium text-slate-700">Main image *</span>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onImage(e.dataTransfer.files?.[0]);
                }}
                className={`mt-1.5 flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-3 transition hover:border-brand-500 ${
                  errors.image ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              >
                <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                  {imgBusy ? <Spinner className="h-5 w-5" /> : form.image ? <img src={form.image} alt="" className="h-full w-full object-cover" /> : <span className="text-2xl">🖼️</span>}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-ink">{form.image ? 'Image change karein' : 'Click ya drag karke upload karein'}</div>
                  <div className="text-xs text-slate-400">JPG, PNG, WEBP · auto-compress hoga</div>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onImage(e.target.files?.[0])} />
              {errors.image && <span className="mt-1 block text-xs text-red-600">{errors.image}</span>}
            </div>

            <Field label="Website title / Business name *" error={errors.title}>
              <input className={input} value={form.title} onChange={set('title')} placeholder={t.demo.title} maxLength={80} />
            </Field>
            <Field label="Tagline" hint="Ek chhoti si line jo aapke business ko describe kare">
              <input className={input} value={form.tagline} onChange={set('tagline')} placeholder={t.demo.tagline} maxLength={160} />
            </Field>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-ink">Contact details</h3>
              {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Field label="Phone" error={errors.phone}>
                    <input className={input} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                  </Field>
                  <Field label="WhatsApp" hint="Floating chat button">
                    <input className={input} type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="919876543210" />
                  </Field>
                </div>
                <Field label="Email" error={errors.email}>
                  <input className={input} type="email" value={form.email} onChange={set('email')} placeholder="you@business.com" />
                </Field>
                <Field label="Address">
                  <textarea className={`${input} resize-none`} rows={2} value={form.address} onChange={set('address')} placeholder="Shop no, area, city" maxLength={200} />
                </Field>
              </div>
            </div>

            {serverError && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}

            <button disabled={saving || imgBusy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-60">
              {saving && <Spinner className="h-4 w-4 border-2 border-white/40 border-t-white" />}
              {saving ? 'Website ban rahi hai...' : 'Generate my website 🚀'}
            </button>
          </form>

          {/* LIVE PREVIEW */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" /></span>
                Live preview
              </div>
              <DeviceToggle value={device} onChange={setDevice} />
            </div>
            <div className="mx-auto overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200" style={{ maxWidth: devices[device].width }}>
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3 truncate rounded bg-white px-3 py-0.5 text-xs text-slate-400 ring-1 ring-slate-200">
                  {(form.title || t.demo.title).toLowerCase().replace(/[^a-z0-9]+/g, '')}.sitecraft.app
                </span>
              </div>
              <ScaledFrame key={device} width={devices[device].width} height={720} scrollable>
                <TemplateRenderer template={t} data={form} />
              </ScaledFrame>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Khali fields me demo content dikh raha hai — final website me sirf aapki details hongi.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
