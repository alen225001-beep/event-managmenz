import { apiRequest } from './api';

export const registrationService = {
  // Register for event and get ticket pass (supports free and paid booking with payment details)
  registerForEvent: async (eventId, options = {}) => {
    const payload = typeof options === 'string' ? { notes: options } : options;
    return await apiRequest(`/registrations/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Process payment for an existing pending registration
  processPayment: async (registrationId, paymentData) => {
    return await apiRequest(`/registrations/${registrationId}/pay`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
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
