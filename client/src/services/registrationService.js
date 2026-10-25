import { apiRequest } from './api';

export const registrationService = {
  // Register for event and get ticket pass
  registerForEvent: async (eventId, notes = '') => {
    return await apiRequest(`/registrations/${eventId}`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  // Get current student's passes
  getMyPasses: async () => {
    return await apiRequest('/registrations/my-passes', {
      method: 'GET',
    });
  },

  // Verify ticket pass by code
  getPassByTicketCode: async (ticketCode) => {
    return await apiRequest(`/registrations/ticket/${ticketCode}`, {
      method: 'GET',
    });
  },

  // Cancel pass
  cancelRegistration: async (id, reason = '') => {
    return await apiRequest(`/registrations/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // Check-in attendee (organizer/admin)
  checkInAttendee: async (id) => {
    return await apiRequest(`/registrations/${id}/checkin`, {
      method: 'PATCH',
    });
  },
};

export default registrationService;
