import { apiRequest } from './api';

export const authService = {
  login: async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('sahrdaya_auth_token', res.token);
      localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
    }
    return res;
  },

  register: async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.token) {
      localStorage.setItem('sahrdaya_auth_token', res.token);
      localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
    }
    return res;
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  updateProfile: async (data) => {
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res.user) {
      localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout: () => {
    localStorage.removeItem('sahrdaya_auth_token');
    localStorage.removeItem('sahrdaya_auth_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('sahrdaya_auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
