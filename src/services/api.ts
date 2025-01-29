import axios from 'axios';
import Cookies from 'js-cookie';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://185.230.64.24:3001';

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('userEmail');
      Cookies.remove('userId');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export interface Alert {
  id: string;
  message: string;
  sender: string;
  groupId: string;
  timestamp: string;
}

export const alertService = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await api.get('/api/alerts');
    return response.data;
  },

  createAlert: async (alert: Omit<Alert, 'id'>): Promise<Alert> => {
    const response = await api.post('/api/alerts', alert);
    return response.data;
  }
};

export default api; 