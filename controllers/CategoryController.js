const CategoryModel = require('../models/CategoryModel');

async function index(req, res) {
    const categories = await CategoryModel.getAll();
    res.render('category/index', { categories });
}

async function store(req, res) {
    const { name } = req.body;
    try {
        await CategoryModel.create(name);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
}

async function update(req, res) {
    const { name } = req.body;
    try {
        await CategoryModel.update(req.params.id, name);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
}

async function destroy(req, res) {
    try {
        await CategoryModel.destroy(req.params.id);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.redirect('/categories');
    }
}

module.exports = { index, store, update, destroy };