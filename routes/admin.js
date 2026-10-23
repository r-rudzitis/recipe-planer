const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const isAdmin = require('../middleware/isAdmin');

router.get('/', isAdmin, AdminController.dashboard);
router.post('/users/:id/delete', isAdmin, AdminController.deleteUser);
router.post('/recipes/:id/delete', isAdmin, AdminController.deleteRecipe);
router.post('/comments/:id/delete', isAdmin, AdminController.deleteComment);

module.exports = router;