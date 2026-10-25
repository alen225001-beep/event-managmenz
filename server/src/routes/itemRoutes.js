const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getItemStats,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Public stats route
router.get('/stats', getItemStats);

// Current user's reported items
router.get('/my/reports', protect, getMyItems);

// General CRUD
router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
