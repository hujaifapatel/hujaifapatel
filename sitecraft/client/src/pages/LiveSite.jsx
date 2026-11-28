import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader } from '../components/States.jsx';

// User ki published website — full screen, bina platform UI ke.
// Routes: /s/:id (Home), /s/:id/products, /s/:id/contact
export default function LiveSite() {
  const { id, page = 'home' } = useParams();
  const { data: site, loading, error } = useFetch(() => api.site(id), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!site) return;
    const label = { products: site.template.content.productsLabel, contact: 'Contact' }[page];
    document.title = label ? `${label} — ${site.data.title}` : `${site.data.title}${site.data.tagline ? ` — ${site.data.tagline}` : ''}`;
    return () => {
      document.title = 'SiteCraft — Ready-made websites for every business';
    };
  }, [site, page]);

  if (!['home', 'products', 'contact'].includes(page)) return <Navigate to={`/s/${id}`} replace />;
  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Website nahi mili" />;
  return <TemplateRenderer template={site.template} data={site.data} page={page} nav={{ mode: 'router', base: `/s/${id}` }} strict />;
}
