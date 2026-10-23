const express = require('express');
const router = express.Router({ mergeParams: true });
const CommentController = require('../controllers/CommentController');
const isAuth = require('../middleware/isAuth');

router.post('/', isAuth, CommentController.store);
router.post('/:id/delete', isAuth, CommentController.destroy);

module.exports = router;