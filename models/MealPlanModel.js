const prisma = require('./prisma');

const include = { recipes: { include: { recipe: true } }, user: true };

async function getByUser(userId) {
    return prisma.mealPlan.findMany({ where: { userId }, include, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
    return prisma.mealPlan.findUnique({ where: { id: Number(id) }, include });
}

async function getAllPublic() {
    return prisma.mealPlan.findMany({ where: { isPublic: true }, include, orderBy: { createdAt: 'desc' } });
}

async function create({ title, userId, isPublic = false }) {
    return prisma.mealPlan.create({ data: { title, userId, isPublic } });
}

async function update(id, { title, isPublic }) {
    const data = {};
    if (title !== undefined) data.title = title;
    if (isPublic !== undefined) data.isPublic = isPublic;
    return prisma.mealPlan.update({ where: { id: Number(id) }, data });
}

async function replaceRecipes(mealPlanId, recipes) {
    await prisma.mealPlanRecipe.deleteMany({ where: { mealPlanId: Number(mealPlanId) } });
    if (recipes && recipes.length > 0) {
        await prisma.mealPlanRecipe.createMany({
            data: recipes.map(r => ({
                mealPlanId: Number(mealPlanId),
                recipeId: Number(r.recipeId),
                dayOfWeek: Number(r.dayOfWeek),
            }))
        });
    }
}

async function destroy(id) {
    return prisma.mealPlan.delete({ where: { id: Number(id) } });
}

module.exports = { getByUser, getById, getAllPublic, create, update, replaceRecipes, destroy };
