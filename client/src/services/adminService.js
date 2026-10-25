import { apiRequest } from './api';

export const adminService = {
  getOverview: async () => {
    return await apiRequest('/admin/overview');
  },

  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },

  updateUserRole: async (userId, data) => {
    return await apiRequest(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getAllClaims: async (status) => {
    const query = status ? `?status=${status}` : '';
    return await apiRequest(`/admin/claims${query}`);
  },
};

export default adminService;
