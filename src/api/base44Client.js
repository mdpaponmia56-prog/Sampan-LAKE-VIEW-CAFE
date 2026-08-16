// Full-Featured Live Base44 SDK & REST API Adapter for Sampan Lake View Cafe

const TOKEN_KEY = 'sampan_auth_token';
const USER_KEY = 'sampan_auth_user';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token, remember = true) {
  if (typeof window === 'undefined') return;
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMsg = (data && typeof data === 'object' && (data.error || data.message)) 
        ? (data.error || data.message) 
        : (typeof data === 'string' && data ? data : `Request failed (${res.status})`);
      throw new ApiError(errorMsg, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError || (err && typeof err === 'object' && 'status' in err)) {
      throw err;
    }
    console.warn(`[API Network Warning] ${endpoint}:`, err?.message || String(err));
    throw err;
  }
}

// Entity mappings
const ENTITY_ENDPOINTS = {
  MenuItem: '/api/menu-items',
  menuItem: '/api/menu-items',
  menuitems: '/api/menu-items',
  Order: '/api/orders',
  order: '/api/orders',
  orders: '/api/orders',
  Reservation: '/api/reservations',
  reservation: '/api/reservations',
  reservations: '/api/reservations',
  Review: '/api/reviews',
  review: '/api/reviews',
  reviews: '/api/reviews',
  User: '/api/users',
  user: '/api/users',
  users: '/api/users'
};

function createEntityHandler(entityName) {
  const endpoint = ENTITY_ENDPOINTS[entityName] || `/api/${entityName.toLowerCase()}s`;

  return {
    list: async (sort, limit) => {
      try {
        let items = await apiFetch(endpoint);
        if (!Array.isArray(items)) return [];
        if (sort && typeof sort === 'string') {
          const desc = sort.startsWith('-');
          const key = desc ? sort.slice(1) : sort;
          items = [...items].sort((a, b) => {
            if (a[key] < b[key]) return desc ? 1 : -1;
            if (a[key] > b[key]) return desc ? -1 : 1;
            return 0;
          });
        }
        if (limit && typeof limit === 'number') {
          items = items.slice(0, limit);
        }
        return items;
      } catch (e) {
        console.error(`Error listing ${entityName}:`, e);
        return [];
      }
    },
    filter: async (criteria = {}) => {
      try {
        let items = await apiFetch(endpoint);
        if (!Array.isArray(items)) return [];
        return items.filter(item => {
          return Object.entries(criteria).every(([k, v]) => item[k] === v);
        });
      } catch (e) {
        console.error(`Error filtering ${entityName}:`, e);
        return [];
      }
    },
    get: async (id) => {
      try {
        const items = await apiFetch(endpoint);
        return items.find(i => String(i.id) === String(id)) || null;
      } catch (e) {
        return null;
      }
    },
    create: async (data) => {
      return await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    update: async (id, data) => {
      // For orders, reservations, reviews status updates, support status sub-route or PUT
      if (entityName === 'Order' || entityName === 'Reservation' || entityName === 'Review') {
        if (data.status && Object.keys(data).length <= 2) {
          return await apiFetch(`${endpoint}/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data)
          });
        }
      }
      return await apiFetch(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    delete: async (id) => {
      return await apiFetch(`${endpoint}/${id}`, {
        method: 'DELETE'
      });
    },
    adjustPrice: async (id, deltaOrPrice) => {
      const body = typeof deltaOrPrice === 'number' 
        ? { delta: deltaOrPrice } 
        : deltaOrPrice;
      return await apiFetch(`${endpoint}/${id}/price`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });
    },
    bulkPrice: async (payload) => {
      return await apiFetch(`${endpoint}/bulk-price`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
    }
  };
}

export const db = {
  auth: {
    isAuthenticated: async () => {
      const token = getAuthToken();
      if (!token) return false;
      try {
        const me = await apiFetch('/api/auth/me');
        return Boolean(me && me.id);
      } catch (e) {
        clearAuthToken();
        return false;
      }
    },
    me: async () => {
      const token = getAuthToken();
      if (!token) return null;
      try {
        return await apiFetch('/api/auth/me');
      } catch (e) {
        return null;
      }
    },
    loginViaEmailPassword: async (identifier, password, remember = true) => {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: identifier, password })
      });
      if (res.token) {
        setAuthToken(res.token, remember);
      }
      return res.user;
    },
    adminLogin: async (identifier, password, remember = true) => {
      const res = await apiFetch('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.token) {
        setAuthToken(res.token, remember);
      }
      return res.user;
    },
    changePassword: async ({ currentPassword, newPassword, newUsername, newEmail }) => {
      return await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword, newUsername, newEmail })
      });
    },
    register: async ({ email, password }) => {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        setAuthToken(res.token, true);
      }
      return res;
    },
    verifyOtp: async ({ email, otpCode }) => {
      const res = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otpCode })
      });
      if (res.access_token) {
        setAuthToken(res.access_token, true);
      }
      return res;
    },
    resendOtp: async (email) => {
      return { success: true };
    },
    setToken: (token) => {
      setAuthToken(token, true);
    },
    loginWithProvider: (provider, returnTo) => {
      window.location.href = returnTo || '/';
    },
    logout: async () => {
      clearAuthToken();
      return true;
    },
    redirectToLogin: (returnTo) => {
      window.location.href = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login';
    }
  },

  // Dynamic entities Proxy supporting ANY entity name
  entities: new Proxy({
    MenuItem: createEntityHandler('MenuItem'),
    Order: createEntityHandler('Order'),
    Reservation: createEntityHandler('Reservation'),
    Review: createEntityHandler('Review'),
    User: createEntityHandler('User')
  }, {
    get: (target, prop) => {
      if (typeof prop === 'symbol') return undefined;
      if (!target[prop]) {
        target[prop] = createEntityHandler(prop);
      }
      return target[prop];
    }
  }),

  users: {
    list: async () => {
      return await apiFetch('/api/users');
    },
    inviteUser: async (email, role = 'user', fullName = '') => {
      return await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ email, role, fullName, password: 'User@Sampan2026!' })
      });
    },
    createUser: async (userData) => {
      return await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    deleteUser: async (id) => {
      return await apiFetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
    }
  },

  analytics: {
    getOverview: async () => {
      return await apiFetch('/api/analytics/overview');
    }
  },

  promos: {
    list: async () => {
      return await apiFetch('/api/promos');
    },
    create: async (promo) => {
      return await apiFetch('/api/promos', {
        method: 'POST',
        body: JSON.stringify(promo)
      });
    },
    validate: async (code, subtotal) => {
      return await apiFetch('/api/promos/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
    }
  },

  settings: {
    get: async () => {
      return await apiFetch('/api/settings');
    },
    update: async (settings) => {
      return await apiFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    },
    getSecurityLogs: async () => {
      return await apiFetch('/api/security/logs');
    }
  },

  backup: {
    list: async () => {
      return await apiFetch('/api/backup/list');
    },
    create: async (label = 'MANUAL') => {
      return await apiFetch('/api/backup/create', {
        method: 'POST',
        body: JSON.stringify({ label })
      });
    },
    restore: async (filename) => {
      return await apiFetch('/api/backup/restore', {
        method: 'POST',
        body: JSON.stringify({ filename })
      });
    },
    import: async (jsonData) => {
      return await apiFetch('/api/backup/import', {
        method: 'POST',
        body: JSON.stringify(jsonData)
      });
    },
    download: async () => {
      const token = getAuthToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/backup/download', { headers });
      if (!res.ok) throw new Error('Failed to download backup');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sampan-database-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  },

  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' })
    }
  }
};

// Expose globally so components with `globalThis.__B44_DB__` bridge automatically without type issues
if (typeof window !== 'undefined') {
  window['__B44_DB__'] = db;
}
if (typeof globalThis !== 'undefined') {
  globalThis['__B44_DB__'] = db;
}

export const base44 = db;
export default db;