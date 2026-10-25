const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Submit a claim for an item
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res, next) => {
  try {
    const { itemId, proofDescription, contactPhone } = req.body;

    if (!itemId || !proofDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide itemId and a detailed proofDescription.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found to claim.',
      });
    }

    // A user cannot claim an item they reported themselves
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit an ownership claim on an item you reported yourself.',
      });
    }

    if (item.status === 'RETURNED') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been marked as returned to its rightful owner.',
      });
    }

    // Check for existing pending claim by this user
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
      status: 'PENDING',
    });

    if (existingClaim) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active pending claim for this item.',
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      proofDescription,
      contactPhone: contactPhone || req.user.phone || '',
    });

    // Update item status to CLAIM_PENDING if currently REPORTED
    if (item.status === 'REPORTED') {
      item.status = 'CLAIM_PENDING';
      await item.save();
    }

    const populated = await Claim.findById(claim._id)
      .populate('claimant', 'name email department studentId phone')
      .populate('item', 'title type category location custodyLocation');

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. The finder or campus security will review your proof.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims filed by the current user
// @route   GET /api/claims/my
// @access  Private
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate({
        path: 'item',
        select: 'title type category location status custodyLocation reportedBy',
        populate: { path: 'reportedBy', select: 'name email department' },
      })
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

// @desc    Get claims filed for a specific item (for item owner or admin)
// @route   GET /api/claims/item/:itemId
// @access  Private
const getItemClaims = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Only item owner or admin/security can view submitted proofs
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'security_staff'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view verification claims for this item.',
      });
    }

    const claims = await Claim.find({ item: req.params.itemId })
      .populate('claimant', 'name email department studentId phone')
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

// @desc    Update claim status (Approve or Reject claim)
// @route   PATCH /api/claims/:id/status
// @access  Private
const updateClaimStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'APPROVED' or 'REJECTED'.",
      });
    }

    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.',
      });
    }

    const item = await Item.findById(claim.item._id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Associated item not found.',
      });
    }

    // Check authorization: must be item reporter, admin, or security staff
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    const isStaff = ['admin', 'security_staff'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to review this claim.',
      });
    }

    claim.status = status;
    claim.reviewNotes = reviewNotes || (status === 'APPROVED' ? 'Proof verified. Handover confirmed.' : 'Proof did not match.');
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    await claim.save();

    if (status === 'APPROVED') {
      // Mark item as RETURNED
      item.status = 'RETURNED';
      item.resolvedAt = new Date();
      item.resolvedBy = req.user._id;
      await item.save();

      // Automatically reject any other pending claims on this item
      await Claim.updateMany(
        { item: item._id, _id: { $ne: claim._id }, status: 'PENDING' },
        {
          status: 'REJECTED',
          reviewNotes: 'Another verified claim was approved for this item.',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        }
      );
    } else if (status === 'REJECTED') {
      // If no other pending claims remain, restore item status to REPORTED
      const remainingPending = await Claim.countDocuments({
        item: item._id,
        status: 'PENDING',
      });
      if (remainingPending === 0 && item.status === 'CLAIM_PENDING') {
        item.status = 'REPORTED';
        await item.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Claim status updated to ${status}.`,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus,
};
