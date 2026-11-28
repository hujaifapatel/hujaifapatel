export const devices = {
  desktop: { width: 1280, label: 'Desktop', icon: 'M3 5h18v11H3zM8 20h8M12 16v4' },
  tablet: { width: 768, label: 'Tablet', icon: 'M6 3h12v18H6zM11 18h2' },
  mobile: { width: 390, label: 'Mobile', icon: 'M8 3h8v18H8zM11 18h2' },
};

export default function DeviceToggle({ value, onChange, dark = false }) {
  return (
    <div className={`inline-flex rounded-lg p-1 ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
      {Object.entries(devices).map(([key, d]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          title={d.label}
          className={`rounded-md px-3 py-1.5 transition ${
            value === key ? (dark ? 'bg-white text-ink' : 'bg-white text-ink shadow-sm') : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-ink'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            <path d={d.icon} />
          </svg>
        </button>
      ))}
    </div>
  );
}
