const MealPlanModel = require('../models/MealPlanModel');
const RecipeModel = require('../models/RecipeModel');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

async function browse(req, res) {
    const mealPlans = await MealPlanModel.getAllPublic();
    res.render('mealplan/browse', { mealPlans });
}

async function index(req, res) {
    const mealPlans = await MealPlanModel.getByUser(req.session.user.id);
    res.render('mealplan/index', { mealPlans });
}

async function show(req, res) {
    const mealPlan = await MealPlanModel.getById(req.params.id);
    if (!mealPlan) return res.status(404).send('Meal plan not found');
    const isOwner = req.session.user && mealPlan.userId === req.session.user.id;
    if (!mealPlan.isPublic && !isOwner) return res.status(403).send('Forbidden');
    const back = req.headers.referer || '/mealplans';
    res.render('mealplan/show', { mealPlan, days: DAYS, isOwner, back });
}

async function store(req, res) {
    const { title, isPublic } = req.body;
    try {
        const mealPlan = await MealPlanModel.create({
            title,
            userId: req.session.user.id,
            isPublic: isPublic === 'on',
        });
        res.redirect('/mealplans/' + mealPlan.id + '/edit');
    } catch (err) {
        console.error(err);
        res.redirect('/mealplans');
    }
}

async function edit(req, res) {
    const mealPlan = await MealPlanModel.getById(req.params.id);
    if (!mealPlan) return res.status(404).send('Meal plan not found');
    if (!req.session.user || mealPlan.userId !== req.session.user.id) return res.status(403).send('Forbidden');
    const recipes = await RecipeModel.getByUser(req.session.user.id);
    res.render('mealplan/edit', { mealPlan, recipes, days: DAYS });
}

async function update(req, res) {
    const mealPlan = await MealPlanModel.getById(req.params.id);
    if (!mealPlan) return res.status(404).send('Meal plan not found');
    if (!req.session.user || mealPlan.userId !== req.session.user.id) return res.status(403).send('Forbidden');
    const { title, isPublic, recipesJson } = req.body;
    try {
        await MealPlanModel.update(req.params.id, { title, isPublic: isPublic === 'on' });
        const recipes = JSON.parse(recipesJson || '[]');
        await MealPlanModel.replaceRecipes(req.params.id, recipes);
        res.redirect('/mealplans/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/mealplans/' + req.params.id + '/edit');
    }
}

async function toggleVisibility(req, res) {
    try {
        const mealPlan = await MealPlanModel.getById(req.params.id);
        if (!mealPlan || mealPlan.userId !== req.session.user.id) return res.status(403).send('Forbidden');
        await MealPlanModel.update(req.params.id, { isPublic: !mealPlan.isPublic });
        res.redirect('/mealplans/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.redirect('/mealplans');
    }
}

async function destroy(req, res) {
    try {
        await MealPlanModel.destroy(req.params.id);
        res.redirect('/mealplans');
    } catch (err) {
        console.error(err);
        res.redirect('/mealplans');
    }
}

module.exports = { browse, index, show, store, edit, update, toggleVisibility, destroy };
