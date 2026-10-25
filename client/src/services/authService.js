import { apiRequest } from './api';

export const authService = {
  // Register new student or organizer
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user profile
  getProfile: async () => {
    return await apiRequest('/auth/profile', {
      method: 'GET',
    });
  },

  // Update profile
  updateProfile: async (userData) => {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

export default authService;
