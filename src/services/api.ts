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

export default api; 