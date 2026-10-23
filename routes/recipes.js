const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/RecipeController');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/upload');

router.get('/my', isAuth, RecipeController.myRecipes);
router.get('/create', isAuth, RecipeController.create);
router.post('/', isAuth, upload.single('image'), RecipeController.store);
router.get('/:id', RecipeController.show);
router.get('/:id/edit', isAuth, RecipeController.edit);
router.post('/:id', isAuth, upload.single('image'), RecipeController.update);
router.post('/:id/delete', isAuth, RecipeController.destroy);

module.exports = router;