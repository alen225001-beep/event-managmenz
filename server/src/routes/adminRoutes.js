const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  getAllClaims,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin/security_staff role
router.use(protect);
router.use(authorize('admin', 'security_staff'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', authorize('admin'), updateUserRole);
router.get('/claims', getAllClaims);

module.exports = router;
