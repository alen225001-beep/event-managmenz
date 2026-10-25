const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getItemClaims,
  updateClaimStatus,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createClaim);
router.get('/my', protect, getMyClaims);
router.get('/item/:itemId', protect, getItemClaims);
router.patch('/:id/status', protect, updateClaimStatus);

module.exports = router;
