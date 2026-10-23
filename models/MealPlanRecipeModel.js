const prisma = require('./prisma');

async function getById(id) {
    return prisma.mealPlanRecipe.findUnique({ where: { id: Number(id) }, include: { recipe: true, mealPlan: true } });
}

module.exports = { getById };