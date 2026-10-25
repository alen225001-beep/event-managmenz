const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  processPayment,
  getMyPasses,
  getPassByTicketCode,
  cancelRegistration,
  checkInAttendee,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.post('/:id/pay', protect, processPayment);
router.get('/my-passes', protect, getMyPasses);
router.get('/ticket/:ticketCode', getPassByTicketCode);
router.patch('/:id/cancel', protect, cancelRegistration);
router.patch('/:id/checkin', protect, authorize('organizer', 'admin'), checkInAttendee);

module.exports = router;
