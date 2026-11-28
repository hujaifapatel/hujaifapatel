// Base URL of the API. Empty = same origin (Vite proxy in dev, Express in production).
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Absolute API URL — used inside downloaded websites, which run on another domain
export const absoluteApiBase = () => API_BASE || window.location.origin;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.errors = body.errors;
    err.status = res.status;
    throw err;
  }
  return body;
}

const owner = (editKey) => ({ headers: { 'x-edit-key': editKey } });

export const api = {
  categories: () => request('/categories'),
  category: (slug) => request(`/categories/${slug}`),
  templates: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/templates${qs ? `?${qs}` : ''}`);
  },
  template: (id) => request(`/templates/${id}`),

  // Websites
  createSite: (payload) => request('/sites', { method: 'POST', body: JSON.stringify(payload) }),
  updateSite: (id, payload, editKey) => request(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(payload), ...owner(editKey) }),
  site: (id) => request(`/sites/${id}`),
  countView: (id) => request(`/sites/${id}/view`, { method: 'POST' }).catch(() => {}),

  // Contact form messages (owner only)
  messages: (id, editKey) => request(`/sites/${id}/messages`, owner(editKey)),
  markMessage: (id, messageId, read, editKey) =>
    request(`/sites/${id}/messages/${messageId}`, { method: 'PATCH', body: JSON.stringify({ read }), ...owner(editKey) }),
  deleteMessage: (id, messageId, editKey) => request(`/sites/${id}/messages/${messageId}`, { method: 'DELETE', ...owner(editKey) }),
};

// The creator's edit keys are kept in this browser (lets them edit without an account)
const KEY = 'sitecraft:editKeys';
const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
};
export const editKeys = {
  get: (id) => readAll()[id] || null,
  ids: () => Object.keys(readAll()),
  set(id, key) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [id]: key }));
    } catch {
      /* storage blocked — ignore */
    }
  },
  remove(id) {
    try {
      const all = readAll();
      delete all[id];
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      /* ignore */
    }
  },
};
