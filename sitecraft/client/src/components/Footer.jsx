import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Build a professional website for your business in minutes. Pick a category, choose a template,
            add your details — and your website is ready!
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/templates" className="hover:text-white">All templates</Link></li>
            <li><a href="/#categories" className="hover:text-white">Categories</a></li>
            <li><a href="/#how" className="hover:text-white">How it works</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Popular</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/category/restaurant" className="hover:text-white">Restaurant</Link></li>
            <li><Link to="/category/fitness" className="hover:text-white">Gym & Fitness</Link></li>
            <li><Link to="/category/business" className="hover:text-white">Business</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs">© {new Date().getFullYear()} SiteCraft. All rights reserved.</div>
    </footer>
  );
}
