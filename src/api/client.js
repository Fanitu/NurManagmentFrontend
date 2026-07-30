const API_BASE = import.meta.env.VITE_API_URL || '/api';

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
  login: (name, password, restaurantId) => request('/auth/login', { method: 'POST', body: { name, password, restaurantId }, auth: false }),
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
  deleteOrder: (id, reason) => request(`/orders/${id}`, { method: 'DELETE', body: { reason } }),

  // running cost
  createRunningCost: (payload) => request('/running-cost', { method: 'POST', body: payload }),

  // monthly expenses
  createMonthlyExpense: (payload) => request('/monthly-expenses', { method: 'POST', body: payload }),
  getAllMonthlyExpenses: () => request('/monthly-expenses'),
  updateMonthlyExpense: (id, payload) => request(`/monthly-expenses/${id}`, { method: 'PUT', body: payload }),
  deleteMonthlyExpense: (id) => request(`/monthly-expenses/${id}`, { method: 'DELETE' }),

  // admin revenue
  getDailyRevenue: () => request('/admin/revenue/daily'),
  getDailyDetail: (date) => request(`/admin/revenue/daily/${date}`),
  getWeeklyRevenue: () => request('/admin/revenue/weekly'),
  getWeeklyDetail: (weekStart) => request(`/admin/revenue/weekly/${weekStart}`),
  getMonthlyRevenue: () => request('/admin/revenue/monthly'),
  getMonthlyDetail: (monthStart) => request(`/admin/revenue/monthly/${monthStart}`),
};
