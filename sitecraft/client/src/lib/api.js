const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
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
  updateSite: (id, payload, editKey) =>
    request(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { 'x-edit-key': editKey } }),
  site: (id) => request(`/sites/${id}`),
};

// Site banane wale browser me edit key save rehti hai (login ke bina edit ke liye)
const KEY = 'sitecraft:editKeys';
export const editKeys = {
  get(id) {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}')[id] || null;
    } catch {
      return null;
    }
  },
  set(id, key) {
    try {
      const all = JSON.parse(localStorage.getItem(KEY) || '{}');
      all[id] = key;
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      /* storage blocked — ignore */
    }
  },
};
