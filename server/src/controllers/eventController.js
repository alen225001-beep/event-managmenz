const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events with search, category filtering & pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      club,
      page = 1,
      limit = 12,
      sort = 'date',
    } = req.query;

    const query = {};

    // Search keyword in title, description, venue, or clubName
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { clubName: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Status filter (default to upcoming unless 'all' requested)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Club filter
    if (club && club !== 'all') {
      query.clubName = new RegExp(club.trim(), 'i');
    }

    // Sorting
    let sortOption = { date: 1 }; // nearest event first
    if (sort === 'popular') {
      sortOption = { registeredCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email phone clubName')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      totalEvents,
      totalPages: Math.ceil(totalEvents / limitNum),
      currentPage: pageNum,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured spotlight events for homepage
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res, next) => {
  try {
    const featured = await Event.find({ status: 'upcoming' })
      .populate('organizer', 'name email clubName')
      .sort({ registeredCount: -1, date: 1 })
      .limit(4);

    res.status(200).json({
      success: true,
      events: featured,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email phone department clubName'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided ID.',
      });
    }

    // Check if the current requesting user is already registered (if auth token provided)
    let isRegistered = false;
    let userPass = null;

    if (req.user) {
      const reg = await Registration.findOne({
        event: event._id,
        user: req.user._id,
        status: { $in: ['confirmed', 'attended'] },
      });
      if (reg) {
        isRegistered = true;
        userPass = reg;
      }
    }

    res.status(200).json({
      success: true,
      event,
      isRegistered,
      userPass,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new campus event
// @route   POST /api/events
// @access  Private (organizer, admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      date,
      time,
      registrationDeadline,
      capacity,
      bannerImage,
      clubName,
      ticketType,
      price,
      tags,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!title || !description || !category || !venue || !date || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details (title, description, category, venue, date, deadline).',
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      venue,
      date,
      time: time || '09:30 AM - 04:30 PM',
      registrationDeadline,
      capacity: capacity || 100,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      clubName: clubName || req.user.clubName || 'Sahrdaya Student Council',
      organizer: req.user._id,
      ticketType: ticketType || 'free',
      price: price || 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
    });

    res.status(201).json({
      success: true,
      message: 'Event created and published successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campus event
// @route   PUT /api/events/:id
// @access  Private (organizer of event, admin)
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event.',
      });
    }

    // Process tags if provided as comma-separated string
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or cancel campus event
// @route   DELETE /api/events/:id
// @access  Private (organizer of event, admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check ownership or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    // Delete associated registrations
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and all associated passes removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendee roster for an event
// @route   GET /api/events/:id/attendees
// @access  Private (organizer of event, admin)
const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendees for this event.',
      });
    }

    const attendees = await Registration.find({ event: event._id })
      .populate('user', 'name email department studentId phone')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: attendees.length,
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue,
        capacity: event.capacity,
        registeredCount: event.registeredCount,
      },
      attendees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
};
