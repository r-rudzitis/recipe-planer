const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const isAdmin = require('../middleware/isAdmin');

router.get('/', isAdmin, CategoryController.index);
router.post('/', isAdmin, CategoryController.store);
router.post('/:id', isAdmin, CategoryController.update);
router.post('/:id/delete', isAdmin, CategoryController.destroy);

module.exports = router;