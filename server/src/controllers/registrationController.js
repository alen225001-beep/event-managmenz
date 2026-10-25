const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Helper to generate unique Sahrdaya Ticket Code
const generateTicketCode = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SHR-EVT-${randomNum}`;
};

// @desc    Register for an event & receive digital ticket/pass
// @route   POST /api/registrations/:eventId
// @access  Private (student, organizer, admin)
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { notes } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided ID.',
      });
    }

    // Check event status
    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: `Registration is not open for this event (current status: ${event.status}).`,
      });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this event has passed.',
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event is completely booked (Sold Out / Housefull).',
      });
    }

    // Check for existing registration
    const existingRegistration = await Registration.findOne({
      event: event._id,
      user: req.user._id,
      status: { $in: ['confirmed', 'attended'] },
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event. Check "My Passes" to view your ticket.',
        ticketCode: existingRegistration.ticketCode,
      });
    }

    // Generate unique ticket code
    let ticketCode = generateTicketCode();
    let isCodeUnique = false;
    while (!isCodeUnique) {
      const codeCheck = await Registration.findOne({ ticketCode });
      if (!codeCheck) {
        isCodeUnique = true;
      } else {
        ticketCode = generateTicketCode();
      }
    }

    // Create registration record
    const registration = await Registration.create({
      event: event._id,
      user: req.user._id,
      ticketCode,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentDepartment: req.user.department || 'General',
      studentId: req.user.studentId || '',
      phone: req.user.phone || '',
      registeredAt: new Date(),
    });

    // Increment registered attendee count atomically
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registeredCount: 1 },
    });

    // Populate event info for client display
    await registration.populate('event', 'title venue date time category clubName bannerImage');

    res.status(201).json({
      success: true,
      message: 'Registration confirmed! Your digital entry pass is ready.',
      registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all passes/registrations for current authenticated student
// @route   GET /api/registrations/my-passes
// @access  Private
const getMyPasses = async (req, res, next) => {
  try {
    const passes = await Registration.find({ user: req.user._id })
      .populate('event', 'title category venue date time clubName bannerImage status')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: passes.length,
      passes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify ticket pass by unique ticket code
// @route   GET /api/registrations/ticket/:ticketCode
// @access  Public
const getPassByTicketCode = async (req, res, next) => {
  try {
    const { ticketCode } = req.params;

    const pass = await Registration.findOne({
      ticketCode: ticketCode.toUpperCase().trim(),
    })
      .populate('event', 'title venue date time category clubName bannerImage status')
      .populate('user', 'name email department studentId phone');

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket code. No pass found in Sahrdaya EventHub records.',
      });
    }

    res.status(200).json({
      success: true,
      pass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an event registration & release seat
// @route   PATCH /api/registrations/:id/cancel
// @access  Private
const cancelRegistration = async (req, res, next) => {
  try {
    const pass = await Registration.findById(req.params.id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Registration pass not found.',
      });
    }

    // Check ownership
    if (pass.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this pass.',
      });
    }

    if (pass.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been cancelled.',
      });
    }

    if (pass.status === 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a pass for an event that has already been attended.',
      });
    }

    pass.status = 'cancelled';
    pass.cancellationReason = req.body.reason || 'User cancelled registration';
    await pass.save();

    // Decrement event registered count atomically
    await Event.findByIdAndUpdate(pass.event, {
      $inc: { registeredCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Registration pass successfully cancelled. Seat released.',
      pass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in attendee at event entrance (Organizer / Admin)
// @route   PATCH /api/registrations/:id/checkin
// @access  Private (organizer, admin)
const checkInAttendee = async (req, res, next) => {
  try {
    const pass = await Registration.findById(req.params.id).populate('event');

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: 'Registration pass not found.',
      });
    }

    // Check organizer permissions for this event
    if (
      pass.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to check in attendees for this event.',
      });
    }

    if (pass.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot check in a cancelled ticket pass.',
      });
    }

    pass.status = 'attended';
    pass.attendedAt = new Date();
    await pass.save();

    res.status(200).json({
      success: true,
      message: `Verified: ${pass.studentName} has been checked in!`,
      pass,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getMyPasses,
  getPassByTicketCode,
  cancelRegistration,
  checkInAttendee,
};
