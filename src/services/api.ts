import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: { username: string; email: string; password: string }) =>
    api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
};

// Menu API
export const menuAPI = {
  getItems: () => api.get("/menu"),
  createItem: (item: any) => api.post("/menu", item),
  updateItem: (id: string, item: any) => api.put(`/menu/${id}`, item),
  deleteItem: (id: string) => api.delete(`/menu/${id}`),
};

// Orders API
export const orderAPI = {
  getOrders: () => api.get("/orders"),
  getOrdersByTable: (tableId: string) => api.get(`/orders/table/${tableId}`),
  createOrder: (order: any) => api.post("/orders", order),
  updateOrder: (id: string, updates: any) => api.put(`/orders/${id}`, updates),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
  markAsDelivered: (id: string) => api.patch(`/orders/${id}/delivered`),
};

// Tables API
export const tableAPI = {
  getTables: () => api.get("/tables"),
  createTable: (table: any) => api.post("/tables", table),
  updateTable: (id: string, table: any) => api.put(`/tables/${id}`, table),
  deleteTable: (id: string) => api.delete(`/tables/${id}`),
  generateQR: (tableId: string) => api.get(`/tables/${tableId}/qr`),
};

export default api;
