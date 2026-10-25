const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Helper to generate unique Sahrdaya Ticket Code
const generateTicketCode = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SHR-EVT-${randomNum}`;
};

// Helper to generate unique Payment Transaction ID
const generatePaymentId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SHR-PAY-${randomNum}`;
};

// @desc    Register for an event & receive digital ticket/pass (with payment verification for paid events)
// @route   POST /api/registrations/:eventId
// @access  Private (student, organizer, admin)
const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { paymentMethod, paymentId, notes } = req.body;

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

    // Check for existing active registration
    const existingRegistration = await Registration.findOne({
      event: event._id,
      user: req.user._id,
      status: { $in: ['confirmed', 'attended'] },
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You already hold an active pass for this event. Check "My Passes" to view your ticket.',
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

    const isPaidEvent = event.ticketType === 'paid' && event.price > 0;

    // Handle Paid Events Requirement: Ticket can ONLY be confirmed after payment is done
    let registrationStatus = 'confirmed';
    let isPaid = false;
    let paymentAmount = 0;
    let txnId = '';
    let finalPaymentMethod = 'Free';
    let paymentStatus = 'not_applicable';
    let paymentDate = null;

    if (isPaidEvent) {
      // If payment details provided from the payment portal
      if (paymentMethod && paymentMethod !== 'Free') {
        isPaid = true;
        paymentAmount = event.price;
        txnId = paymentId || generatePaymentId();
        finalPaymentMethod = paymentMethod;
        paymentStatus = 'completed';
        paymentDate = new Date();
        registrationStatus = 'confirmed';
      } else {
        // Pending payment state: ticket is NOT confirmed until payment is processed
        registrationStatus = 'pending_payment';
        paymentAmount = event.price;
        paymentStatus = 'pending';
      }
    }

    // Create registration record
    const registration = await Registration.create({
      event: event._id,
      user: req.user._id,
      ticketCode,
      status: registrationStatus,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentDepartment: req.user.department || 'General',
      studentId: req.user.studentId || '',
      phone: req.user.phone || '',
      isPaid,
      paymentAmount,
      paymentId: txnId,
      paymentMethod: finalPaymentMethod,
      paymentStatus,
      paymentDate,
      registeredAt: new Date(),
    });

    // If confirmed (free or payment completed), increment registered attendee count atomically
    if (registrationStatus === 'confirmed') {
      await Event.findByIdAndUpdate(event._id, {
        $inc: { registeredCount: 1 },
      });
    }

    // Populate event info for client display
    await registration.populate('event', 'title venue date time category clubName bannerImage ticketType price');

    const successMessage = isPaidEvent
      ? (isPaid
          ? `Payment of ₹${event.price} verified! Your entry pass is confirmed.`
          : 'Registration initiated. Please complete payment to confirm your admission pass.')
      : 'Free registration confirmed! Your entry pass is ready.';

    res.status(201).json({
      success: true,
      message: successMessage,
      requiresPayment: isPaidEvent && !isPaid,
      registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment for pending registration
// @route   POST /api/registrations/:id/pay
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentId } = req.body;

    const registration = await Registration.findById(id).populate('event');
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration pass not found.',
      });
    }

    // Check ownership
    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only pay for your own registration.',
      });
    }

    if (registration.status === 'confirmed' && registration.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'This registration has already been paid and confirmed.',
      });
    }

    const event = registration.event;

    // Check capacity before locking paid seat
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event has reached full capacity while awaiting payment.',
      });
    }

    const txnId = paymentId || generatePaymentId();

    registration.isPaid = true;
    registration.paymentAmount = event.price || 0;
    registration.paymentId = txnId;
    registration.paymentMethod = paymentMethod || 'UPI / QR';
    registration.paymentStatus = 'completed';
    registration.paymentDate = new Date();
    registration.status = 'confirmed';
    await registration.save();

    // Increment event attendee count atomically now that payment is confirmed
    await Event.findByIdAndUpdate(event._id, {
      $inc: { registeredCount: 1 },
    });

    res.status(200).json({
      success: true,
      message: `Payment of ₹${registration.paymentAmount} verified! Ticket ${registration.ticketCode} is now confirmed.`,
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
      .populate('event', 'title category venue date time clubName bannerImage status ticketType price')
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
      .populate('event', 'title venue date time category clubName bannerImage status ticketType price')
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

    const previousStatus = pass.status;
    pass.status = 'cancelled';
    pass.cancellationReason = req.body.reason || 'Student voluntary cancellation';
    if (pass.isPaid) {
      pass.paymentStatus = 'refunded';
    }
    await pass.save();

    // Decrement event registered count atomically only if it was confirmed
    if (previousStatus === 'confirmed') {
      await Event.findByIdAndUpdate(pass.event, {
        $inc: { registeredCount: -1 },
      });
    }

    res.status(200).json({
      success: true,
      message: pass.isPaid
        ? 'Registration cancelled. A refund of ₹' + pass.paymentAmount + ' has been initiated.'
        : 'Registration pass successfully cancelled. Seat released.',
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

    if (pass.status === 'pending_payment') {
      return res.status(400).json({
        success: false,
        message: 'Cannot check in an unconfirmed ticket. Payment is still pending.',
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
  processPayment,
  getMyPasses,
  getPassByTicketCode,
  cancelRegistration,
  checkInAttendee,
};
