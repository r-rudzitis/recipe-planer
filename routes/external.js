const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ExternalRecipeController');
const isAuth = require('../middleware/isAuth');

router.get('/search', ctrl.search);
router.post('/import/:spoonacularId', isAuth, ctrl.importRecipe);

module.exports = router;
