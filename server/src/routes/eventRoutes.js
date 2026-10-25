const express = require('express');
const router = express.Router();
const {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', (req, res, next) => {
  // Optional auth check for registration status
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, () => getEventById(req, res, next));
  }
  return getEventById(req, res, next);
});

// Protected organizer/admin endpoints
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);
router.get('/:id/attendees', protect, authorize('organizer', 'admin'), getEventAttendees);

module.exports = router;
