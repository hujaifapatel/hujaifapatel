import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Templates from './pages/Templates.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import TemplatePreview from './pages/TemplatePreview.jsx';
import Customize from './pages/Customize.jsx';
import SiteReady from './pages/SiteReady.jsx';
import LiveSite from './pages/LiveSite.jsx';
import NotFound from './pages/NotFound.jsx';
import MySites from './pages/MySites.jsx';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Links like "/#categories" scroll to that section, otherwise to the top
    if (hash) {
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // /s/:id = the user's live website — no platform navbar/footer there
  const bare = pathname.startsWith('/s/');

  return (
    <>
      <ScrollToTop />
      {!bare && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/template/:id" element={<TemplatePreview />} />
        <Route path="/customize/:id" element={<Customize />} />
        <Route path="/site/:id" element={<SiteReady />} />
        <Route path="/my-sites" element={<MySites />} />
        <Route path="/s/:id" element={<LiveSite />} />
        <Route path="/s/:id/:page" element={<LiveSite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!bare && <Footer />}
    </>
  );
}
