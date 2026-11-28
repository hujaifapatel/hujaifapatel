import { Link } from 'react-router-dom';
import ScaledFrame from './ScaledFrame.jsx';
import { TemplateRenderer } from '../templates/index.jsx';

const layoutLabel = { classic: 'Classic', bold: 'Bold', minimal: 'Minimal', dark: 'Dark' };

export default function TemplateCard({ template, categoryName }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative overflow-hidden bg-slate-100">
        <ScaledFrame width={1280} aspect={0.68}>
          <TemplateRenderer template={template} fab={false} />
        </ScaledFrame>
        {/* Overlay link (the template itself contains <a> tags, so it cannot be wrapped in a link) */}
        <Link to={`/template/${template._id}`} aria-label={`${template.name} preview`} className="absolute inset-0 flex items-center justify-center bg-ink/0 transition group-hover:bg-ink/50">
          <span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink opacity-0 shadow transition group-hover:opacity-100">Live Preview</span>
        </Link>
        {template.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow">
            Featured
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{template.name}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {categoryName || template.category} · {layoutLabel[template.layout]}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: template.theme.primary }} />
          <Link to={`/customize/${template._id}`} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100">
            Use
          </Link>
        </div>
      </div>
    </div>
  );
}
