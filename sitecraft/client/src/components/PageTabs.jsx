// Template website ke 3 pages ke tabs (Home / Products / Contact)
export default function PageTabs({ template, value, onChange, dark = false }) {
  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'products', label: template?.content?.productsLabel || 'Products' },
    { key: 'contact', label: 'Contact' },
  ];
  return (
    <div className={`inline-flex rounded-lg p-1 text-sm font-medium ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`rounded-md px-3 py-1.5 transition ${
            value === t.key ? 'bg-white text-ink shadow-sm' : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
