const steps = ['Category', 'Template', 'Details', 'Website ready'];

export default function Steps({ current = 0 }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-medium sm:gap-3 sm:text-sm">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2 sm:gap-3">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
              i < current ? 'bg-brand-500 text-white' : i === current ? 'bg-ink text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </span>
          <span className={`hidden sm:inline ${i === current ? 'text-ink' : 'text-slate-400'}`}>{s}</span>
          {i < steps.length - 1 && <span className="h-px w-4 bg-slate-300 sm:w-8" />}
        </li>
      ))}
    </ol>
  );
}
