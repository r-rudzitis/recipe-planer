const RecipeModel = require('../models/RecipeModel');
const CategoryModel = require('../models/CategoryModel');

async function index(req, res) {
    const { search, categoryId } = req.query;
    const recipes = await RecipeModel.getAllPublic({ search, categoryId });
    const categories = await CategoryModel.getAll();
    res.render('index', { recipes, categories, search: search || '', categoryId: categoryId || '' });
}

async function myRecipes(req, res) {
    const recipes = await RecipeModel.getByUser(req.session.user.id);
    res.render('recipe/my', { recipes });
}

async function show(req, res) {
    const recipe = await RecipeModel.getById(req.params.id);
    if (!recipe) return res.status(404).render('errors/error', {
        title: 'Recipe not found',
        message: 'This recipe does not exist or may have been deleted.',
        backHref: '/', backLabel: 'Browse recipes'
    });
    const isOwner = req.session.user && req.session.user.id === recipe.userId;
    const isAdmin = req.session.user && req.session.user.role === 'admin';
    if (!recipe.isPublic && !isOwner && !isAdmin) return res.status(403).render('errors/error', {
        title: 'This recipe is private',
        message: 'The author has not made this recipe public.',
        backHref: '/', backLabel: 'Browse recipes'
    });
    res.render('recipe/show', { recipe });
}

async function create(req, res) {
    const categories = await CategoryModel.getAll();
    res.render('recipe/create', { categories, recipe: null, error: null });
}

async function store(req, res) {
    if (!req.body) {
        console.error('req.body is undefined — multer may not be running');
        return res.status(400).send('Form processing error');
    }
    const { title, description, categoryId, isPublic, ingredientName, ingredientAmount, ingredientUnit } = req.body;
    const ingredients = (ingredientName || []).map((name, i) => ({
        name,
        amount: ingredientAmount[i] || '',
        unit: ingredientUnit[i] || '',
    }));
    try {
        await RecipeModel.create({
            title,
            description,
            imagePath: req.file ? '/uploads/' + req.file.filename : null,
            isPublic: isPublic === 'on',
            userId: req.session.user.id,
            categoryId: Number(categoryId),
            ingredients,
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const categories = await CategoryModel.getAll();
        res.render('recipe/create', { categories, recipe: null, error: 'Could not save recipe.' });
    }
}

async function edit(req, res) {
    const recipe = await RecipeModel.getById(req.params.id);
    if (!recipe) return res.status(404).render('errors/error', {
        title: 'Recipe not found',
        message: 'This recipe does not exist or may have been deleted.',
        backHref: '/', backLabel: 'Browse recipes'
    });
    if (recipe.userId !== req.session.user.id && req.session.user.role !== 'admin') {
        return res.status(403).render('errors/error', {
            title: 'Forbidden',
            message: 'You do not have permission to edit this recipe.',
            backHref: '/', backLabel: 'Go home'
        });
    }
    const categories = await CategoryModel.getAll();
    res.render('recipe/create', { categories, recipe, error: null });
}

async function update(req, res) {
    const { title, description, categoryId, isPublic, ingredientName, ingredientAmount, ingredientUnit } = req.body;
    const ingredients = (ingredientName || []).map((name, i) => ({
        name,
        amount: ingredientAmount[i] || '',
        unit:   ingredientUnit[i]   || '',
    }));
    try {
        const existing = await RecipeModel.getById(req.params.id);
        await RecipeModel.update(req.params.id, {
            title,
            description,
            imagePath: req.file ? '/uploads/' + req.file.filename : existing.imagePath,
            isPublic: isPublic === 'on',
            categoryId: Number(categoryId),
            ingredients,
        });
        res.redirect('/recipes/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/recipes/' + req.params.id + '/edit');
    }
}

async function destroy(req, res) {
    const recipe = await RecipeModel.getById(req.params.id);
    if (!recipe) return res.status(404).render('errors/error', {
        title: 'Recipe not found',
        message: 'This recipe does not exist or may have been deleted.',
        backHref: '/', backLabel: 'Browse recipes'
    });
    if (recipe.userId !== req.session.user.id && req.session.user.role !== 'admin') {
        return res.status(403).render('errors/error', {
            title: 'Forbidden',
            message: 'You do not have permission to delete this recipe.',
            backHref: '/', backLabel: 'Go home'
        });
    }
    await RecipeModel.destroy(req.params.id);
    res.redirect('/');
}

module.exports = { index, myRecipes, show, create, store, edit, update, destroy };