import { apiRequest } from './api';

export const claimService = {
  createClaim: async (claimData) => {
    return await apiRequest('/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },

  getMyClaims: async () => {
    return await apiRequest('/claims/my');
  },

  getItemClaims: async (itemId) => {
    return await apiRequest(`/claims/item/${itemId}`);
  },

  updateClaimStatus: async (claimId, status, reviewNotes) => {
    return await apiRequest(`/claims/${claimId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes }),
    });
  },
};

export default claimService;
