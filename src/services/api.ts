import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post("/auth/register", userData),
  me: () => api.get("/auth/me"),
};

export const menuApi = {
  getAll: (params?: { category?: string; available?: boolean }) =>
    api.get("/menu", { params }),
  getById: (id: string) => api.get(`/menu/${id}`),
  create: (data: any) => api.post("/menu", data),
  update: (id: string, data: any) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

export const orderApi = {
  getAll: (params?: { status?: string; tableId?: string }) =>
    api.get("/orders", { params }),
  getByTable: (tableId: string) => api.get(`/orders/table/${tableId}`),
  create: (data: any) => api.post("/orders", data),
  addItems: (orderId: string, items: any[]) =>
    api.post(`/orders/${orderId}/items`, { items }),
  updateItemStatus: (orderId: string, itemId: string, status: string) =>
    api.patch(`/orders/${orderId}/items/${itemId}/status`, { status }),
  complete: (orderId: string) => api.post(`/orders/${orderId}/complete`),
};

export const tableApi = {
  getAll: () => api.get("/tables"),
  getById: (id: string) => api.get(`/tables/${id}`),
  getByQR: (qrCode: string) => api.get(`/tables/qr/${qrCode}`),
  create: (data: any) => api.post("/tables", data),
  update: (id: string, data: any) => api.put(`/tables/${id}`, data),
};

export default api;
