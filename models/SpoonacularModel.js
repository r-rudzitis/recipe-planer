const API_BASE = 'https://api.spoonacular.com';

async function searchRecipes(query, ingredients) {
    const params = new URLSearchParams({ apiKey: process.env.SPOONACULAR_API_KEY, number: '12' });
    if (query) params.set('query', query);
    if (ingredients) params.set('includeIngredients', ingredients);

    const res = await fetch(`${API_BASE}/recipes/complexSearch?${params}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Spoonacular error ${res.status}`);
    }
    const data = await res.json();
    return data.results || [];
}

async function getRecipeDetails(id) {
    const params = new URLSearchParams({ apiKey: process.env.SPOONACULAR_API_KEY });
    const res = await fetch(`${API_BASE}/recipes/${id}/information?${params}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Spoonacular error ${res.status}`);
    }
    return res.json();
}

module.exports = { searchRecipes, getRecipeDetails };
