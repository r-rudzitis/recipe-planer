const prisma = require('./prisma');

async function getByRecipe(recipeId) {
    return prisma.ingredient.findMany({ where: { recipeId: Number(recipeId) } });
}

async function create({ name, amount, unit, recipeId }) {
    return prisma.ingredient.create({ data: { name, amount, unit, recipeId } });
}

async function destroy(id) {
    return prisma.ingredient.delete({ where: { id: Number(id) } });
}

module.exports = { getByRecipe, create, destroy };