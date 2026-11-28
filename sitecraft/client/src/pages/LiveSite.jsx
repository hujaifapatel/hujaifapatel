import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { TemplateRenderer } from '../templates/index.jsx';
import { ErrorState, PageLoader } from '../components/States.jsx';

// User ki published website — full screen, bina platform UI ke
export default function LiveSite() {
  const { id } = useParams();
  const { data: site, loading, error } = useFetch(() => api.site(id), [id]);

  useEffect(() => {
    if (site) document.title = `${site.data.title}${site.data.tagline ? ` — ${site.data.tagline}` : ''}`;
    return () => {
      document.title = 'SiteCraft — Ready-made websites for every business';
    };
  }, [site]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} title="Website nahi mili" />;
  return <TemplateRenderer template={site.template} data={site.data} strict />;
}
