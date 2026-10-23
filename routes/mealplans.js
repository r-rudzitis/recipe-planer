const express = require('express');
const router = express.Router();
const MealPlanController = require('../controllers/MealPlanController');
const isAuth = require('../middleware/isAuth');

router.get('/browse', MealPlanController.browse);
router.get('/', isAuth, MealPlanController.index);
router.post('/', isAuth, MealPlanController.store);
router.get('/:id/edit', isAuth, MealPlanController.edit);
router.post('/:id/edit', isAuth, MealPlanController.update);
router.get('/:id', MealPlanController.show);
router.post('/:id/toggle', isAuth, MealPlanController.toggleVisibility);
router.post('/:id/delete', isAuth, MealPlanController.destroy);

module.exports = router;
