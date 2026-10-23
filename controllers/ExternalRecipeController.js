const SpoonacularModel = require('../models/SpoonacularModel');
const RecipeModel = require('../models/RecipeModel');

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
        .trim();
}

function buildDescription(data) {
    const summary = stripHtml(data.summary || '');
    let steps = '';
    if (data.analyzedInstructions && data.analyzedInstructions[0]?.steps?.length) {
        steps = data.analyzedInstructions[0].steps
            .map((s, i) => `${i + 1}. ${s.step}`)
            .join('\n');
    } else if (data.instructions) {
        steps = stripHtml(data.instructions);
    }
    return [summary, steps].filter(Boolean).join('\n\n');
}

async function search(req, res) {
    const { q = '', ingredients = '', importError } = req.query;
    let results = [];
    let error = null;

    if (q || ingredients) {
        try {
            results = await SpoonacularModel.searchRecipes(q, ingredients);
        } catch (err) {
            console.error('Spoonacular search error:', err.message);
            error = req.t('external_api_error');
        }
    }

    if (importError) error = req.t('external_import_error');

    res.render('external/search', { results, query: q, ingredients, error });
}

async function importRecipe(req, res) {
    const { spoonacularId } = req.params;
    try {
        const data = await SpoonacularModel.getRecipeDetails(spoonacularId);
        const recipe = await RecipeModel.importExternal({
            title: data.title,
            description: buildDescription(data),
            imagePath: data.image || null,
            userId: req.session.user.id,
            ingredients: (data.extendedIngredients || []).map(ing => ({
                name: ing.name,
                amount: String(Math.round((ing.amount || 0) * 100) / 100),
                unit: ing.unit || '',
            })),
        });
        res.redirect(`/recipes/${recipe.id}/edit`);
    } catch (err) {
        console.error('Import error:', err.message);
        res.redirect('/external/search?importError=1');
    }
}

module.exports = { search, importRecipe };
