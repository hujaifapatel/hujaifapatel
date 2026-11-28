import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import ScaledFrame from '../components/ScaledFrame.jsx';
import DeviceToggle, { devices } from '../components/DeviceToggle.jsx';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader } from '../components/States.jsx';

function useViewportHeight() {
  const [h, setH] = useState(() => window.innerHeight);
  useEffect(() => {
    const on = () => setH(window.innerHeight);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return h;
}

export default function TemplatePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(() => (window.innerWidth < 640 ? 'mobile' : 'desktop'));
  const vh = useViewportHeight();
  const { data: t, loading, error } = useFetch(() => api.template(id), [id]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Template nahi mila" />;

  return (
    <main className="bg-slate-800">
      <div className="sticky top-16 z-40 border-b border-white/10 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to={`/category/${t.category}`} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Back">←</Link>
            <div className="min-w-0">
              <h1 className="truncate font-semibold">{t.name}</h1>
              <p className="truncate text-xs text-slate-400">{t.description}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <DeviceToggle value={device} onChange={setDevice} dark />
          </div>
          <button onClick={() => navigate(`/customize/${t._id}`)} className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold hover:bg-brand-600">
            Use this template →
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6">
        <div className={`mx-auto overflow-hidden rounded-xl bg-white shadow-2xl transition-all ${device === 'mobile' ? 'ring-8 ring-slate-950' : ''}`} style={{ maxWidth: devices[device].width }}>
          <ScaledFrame key={device} width={devices[device].width} height={Math.max(480, vh - 190)} scrollable>
            <TemplateRenderer template={t} />
          </ScaledFrame>
        </div>
      </div>
    </main>
  );
}
