const UserModel = require('../models/UserModel');
const RecipeModel = require('../models/RecipeModel');
const CommentModel = require('../models/CommentModel');

async function dashboard(req, res) {
    const users = await UserModel.listUsers();
    const recipes = await RecipeModel.listAll();
    const comments = await CommentModel.listAll();
    res.render('admin/index', { users, recipes, comments });
}

async function deleteUser(req, res) {
    try {
        await UserModel.deleteUser(Number(req.params.id));
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
}

async function deleteRecipe(req, res) {
    try {
        await RecipeModel.destroy(req.params.id);
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
}

async function deleteComment(req, res) {
    try {
        await CommentModel.deleteComment(Number(req.params.id));
    } catch (err) {
        console.error(err);
    }
    res.redirect('/admin');
}

module.exports = { dashboard, deleteUser, deleteRecipe, deleteComment };