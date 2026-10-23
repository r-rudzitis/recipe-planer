const CommentModel = require('../models/CommentModel');

async function store(req, res) {
    const { body } = req.body;
    const recipeId = req.params.recipeId;
    try {
        await CommentModel.createComment({
            body,
            userId: req.session.user.id,
            recipeId: Number(recipeId),
        });
        res.redirect('/recipes/' + recipeId);
    } catch (err) {
        console.error(err);
        res.redirect('/recipes/' + recipeId);
    }
}

async function destroy(req, res) {
    const { recipeId } = req.params;
    try {
        const comment = await CommentModel.findById(Number(req.params.id));
        if (!comment) return res.redirect('/recipes/' + recipeId);
        if (comment.userId !== req.session.user.id && req.session.user.role !== 'admin') {
            return res.status(403).send('Forbidden');
        }
        await CommentModel.deleteComment(Number(req.params.id));
        res.redirect('/recipes/' + recipeId);
    } catch (err) {
        console.error(err);
        res.redirect('/recipes/' + recipeId);
    }
}

module.exports = { store, destroy };