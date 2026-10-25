const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get all items with search, filter, pagination
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const { search, type, category, status, location, page = 1, limit = 9, sort = '-createdAt' } = req.query;

    const query = {};

    // Filter by type: LOST or FOUND
    if (type && ['LOST', 'FOUND'].includes(type.toUpperCase())) {
      query.type = type.toUpperCase();
    }

    // Filter by category
    if (category && category !== 'ALL') {
      query.category = category;
    }

    // Filter by status (default hides ARCHIVED unless explicitly requested)
    if (status && status !== 'ALL') {
      query.status = status;
    } else if (!status) {
      query.status = { $ne: 'ARCHIVED' };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Full-text or regex search on title, description, and location
    if (search && search.trim() !== '') {
      const sanitized = search.trim();
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNumber - 1) * pageSize;

    const [total, items] = await Promise.all([
      Item.countDocuments(query),
      Item.find(query)
        .populate('reportedBy', 'name email department avatar')
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNumber,
      pages: totalPages,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'name email department phone studentId')
      .populate('resolvedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found with given ID',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lost or found item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      dateLostOrFound,
      custodyLocation,
      distinguishingMarks,
      contactPhone,
      contactEmail,
      imageUrl,
    } = req.body;

    if (!title || !description || !type || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, type, category, and location.',
      });
    }

    const item = await Item.create({
      title,
      description,
      type: type.toUpperCase(),
      category,
      location,
      dateLostOrFound: dateLostOrFound || new Date(),
      custodyLocation: custodyLocation || (type.toUpperCase() === 'FOUND' ? 'Campus Security Gate' : 'N/A'),
      distinguishingMarks: distinguishingMarks || '',
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email,
      imageUrl: imageUrl || '',
      reportedBy: req.user._id,
    });

    const populatedItem = await Item.findById(item._id).populate('reportedBy', 'name email department');

    res.status(201).json({
      success: true,
      message: `${type.toUpperCase() === 'LOST' ? 'Lost item reported' : 'Found item logged'} successfully.`,
      data: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Ownership check: must be owner or admin
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this report.',
      });
    }

    const {
      title,
      description,
      category,
      location,
      status,
      custodyLocation,
      distinguishingMarks,
      contactPhone,
      imageUrl,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (status) item.status = status;
    if (custodyLocation) item.custodyLocation = custodyLocation;
    if (distinguishingMarks !== undefined) item.distinguishingMarks = distinguishingMarks;
    if (contactPhone !== undefined) item.contactPhone = contactPhone;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;

    if (status === 'RETURNED' && !item.resolvedAt) {
      item.resolvedAt = new Date();
      item.resolvedBy = req.user._id;
    }

    await item.save();

    const updated = await Item.findById(item._id).populate('reportedBy', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this report.',
      });
    }

    // Delete item and related claims
    await Promise.all([
      Item.findByIdAndDelete(req.params.id),
      Claim.deleteMany({ item: req.params.id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Item report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items reported by currently logged-in user
// @route   GET /api/items/my/reports
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .sort('-createdAt')
      .populate('reportedBy', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate stats for campus portal
// @route   GET /api/items/stats
// @access  Public
const getItemStats = async (req, res, next) => {
  try {
    const [totalLost, totalFound, totalReturned, totalActive] = await Promise.all([
      Item.countDocuments({ type: 'LOST' }),
      Item.countDocuments({ type: 'FOUND' }),
      Item.countDocuments({ status: 'RETURNED' }),
      Item.countDocuments({ status: { $in: ['REPORTED', 'CLAIM_PENDING'] } }),
    ]);

    const totalReports = totalLost + totalFound;
    const returnRate = totalReports > 0 ? Math.round((totalReturned / totalReports) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        totalLost,
        totalFound,
        totalReturned,
        totalActive,
        returnRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getItemStats,
};
