import { apiRequest } from './api';

export const eventService = {
  // Get all events with search, category filtering & pagination
  getEvents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.club && params.club !== 'all') query.append('club', params.club);
    if (params.page) query.append('page', params.page);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await apiRequest(`/events${queryString}`, { method: 'GET' });
  },

  // Get featured upcoming spotlight events
  getFeaturedEvents: async () => {
    return await apiRequest('/events/featured', { method: 'GET' });
  },

  // Get single event details
  getEventById: async (id) => {
    return await apiRequest(`/events/${id}`, { method: 'GET' });
  },

  // Create new event (organizer/admin)
  createEvent: async (eventData) => {
    return await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Update event
  updateEvent: async (id, eventData) => {
    return await apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  deleteEvent: async (id) => {
    return await apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Get attendee roster for event
  getEventAttendees: async (id) => {
    return await apiRequest(`/events/${id}/attendees`, {
      method: 'GET',
    });
  },
};

export default eventService;
