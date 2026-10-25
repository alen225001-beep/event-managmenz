const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get system analytics & stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    const totalRegistrations = await Registration.countDocuments();
    const checkedInCount = await Registration.countDocuments({ status: 'attended' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });

    // Category breakdown
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSeats: { $sum: '$capacity' } } },
      { $sort: { count: -1 } },
    ]);

    // Top hosting clubs
    const clubStats = await Event.aggregate([
      { $group: { _id: '$clubName', count: { $sum: 1 }, attendees: { $sum: '$registeredCount' } } },
      { $sort: { attendees: -1 } },
      { $limit: 6 },
    ]);

    const checkInRate = totalRegistrations > 0
      ? Math.round((checkedInCount / totalRegistrations) * 100)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        totalRegistrations,
        checkedInCount,
        checkInRate,
        totalStudents,
        totalOrganizers,
      },
      categoryStats,
      clubStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or active status
// @route   PATCH /api/admin/users/:id
// @access  Private (admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { role, isActive, clubName } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (role && ['student', 'organizer', 'admin'].includes(role)) {
      user.role = role;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }
    if (clubName !== undefined) {
      user.clubName = clubName;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        clubName: user.clubName,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
};
