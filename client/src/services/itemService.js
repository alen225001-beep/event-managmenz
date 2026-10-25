import { apiRequest } from './api';

export const itemService = {
  getItems: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return await apiRequest(`/items${queryString ? `?${queryString}` : ''}`);
  },

  getItemById: async (id) => {
    return await apiRequest(`/items/${id}`);
  },

  createItem: async (itemData) => {
    return await apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  updateItem: async (id, itemData) => {
    return await apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  deleteItem: async (id) => {
    return await apiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  },

  getMyReports: async () => {
    return await apiRequest('/items/my/reports');
  },

  getStats: async () => {
    return await apiRequest('/items/stats');
  },
};

export default itemService;
