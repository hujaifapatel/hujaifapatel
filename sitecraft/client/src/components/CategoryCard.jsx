import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`} className="group relative block overflow-hidden rounded-2xl bg-ink">
      <img src={category.cover} alt={category.name} loading="lazy" className="aspect-[4/3] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-3xl">{category.icon}</div>
        <h3 className="mt-2 text-lg font-bold text-white">{category.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-300">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-400">
          {category.templateCount} templates <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
