const API_BASE = 'https://nurmanagmentbackend-production.up.railway.app' || '/api';

function getToken() {
  return localStorage.getItem('oms_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // auth
  login: (name, password) => request('/auth/login', { method: 'POST', body: { name, password }, auth: false }),
  getMe: () => request('/auth/me'),

  // order list (catalog)
  getOrderList: () => request('/orderlist'),
  createOrderListItem: (payload) => request('/orderlist', { method: 'POST', body: payload }),
  updateOrderListItem: (id, payload) => request(`/orderlist/${id}`, { method: 'PUT', body: payload }),
  deleteOrderListItem: (id) => request(`/orderlist/${id}`, { method: 'DELETE' }),

  // orders
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  getTodaysOrders: () => request('/orders/today'),
  getAllOrders: () => request('/orders'),
  updateOrder: (id, payload) => request(`/orders/${id}`, { method: 'PUT', body: payload }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // running cost
  createRunningCost: (payload) => request('/running-cost', { method: 'POST', body: payload }),

  // admin revenue
  getDailyRevenue: () => request('/admin/revenue/daily'),
  getWeeklyRevenue: () => request('/admin/revenue/weekly'),
  getMonthlyRevenue: () => request('/admin/revenue/monthly'),
};
