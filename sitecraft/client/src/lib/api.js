const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.errors = body.errors;
    err.status = res.status;
    throw err;
  }
  return body;
}

export const api = {
  categories: () => request('/categories'),
  category: (slug) => request(`/categories/${slug}`),
  templates: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/templates${qs ? `?${qs}` : ''}`);
  },
  template: (id) => request(`/templates/${id}`),
  createSite: (payload) => request('/sites', { method: 'POST', body: JSON.stringify(payload) }),
  site: (id) => request(`/sites/${id}`),
};
