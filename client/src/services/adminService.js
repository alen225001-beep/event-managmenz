import { apiRequest } from './api';

export const adminService = {
  // Get administrative analytics and stats
  getAdminStats: async () => {
    return await apiRequest('/admin/stats', {
      method: 'GET',
    });
  },

  // Get all users
  getAllUsers: async () => {
    return await apiRequest('/admin/users', {
      method: 'GET',
    });
  },

  // Update user role or status
  updateUserStatus: async (userId, updateData) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },
};

export default adminService;
