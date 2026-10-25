const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get system-wide metrics and dashboard data
// @route   GET /api/admin/overview
// @access  Private/Admin
const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalItems,
      totalLost,
      totalFound,
      totalReturned,
      totalPendingClaims,
      categoryBreakdown,
      recentItems,
      recentClaims,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ type: 'LOST' }),
      Item.countDocuments({ type: 'FOUND' }),
      Item.countDocuments({ status: 'RETURNED' }),
      Claim.countDocuments({ status: 'PENDING' }),
      Item.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Item.find()
        .sort('-createdAt')
        .limit(6)
        .populate('reportedBy', 'name email department'),
      Claim.find({ status: 'PENDING' })
        .sort('-createdAt')
        .limit(6)
        .populate('claimant', 'name email department')
        .populate('item', 'title type category location'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalItems,
          totalLost,
          totalFound,
          totalReturned,
          totalPendingClaims,
          resolutionRate:
            totalItems > 0 ? Math.round((totalReturned / totalItems) * 100) : 0,
        },
        categoryBreakdown,
        recentItems,
        recentClaims,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users with role and department
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { role, department, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password')
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (role && ['student', 'faculty', 'security_staff', 'admin'].includes(role)) {
      user.role = role;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User permissions updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims across campus for admin review
// @route   GET /api/admin/claims
// @access  Private/Admin
const getAllClaims = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const claims = await Claim.find(query)
      .populate('claimant', 'name email department studentId phone')
      .populate('item', 'title type category location status custodyLocation')
      .populate('reviewedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  getAllClaims,
};
