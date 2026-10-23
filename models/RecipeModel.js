const prisma = require('./prisma');

const include = { category: true, user: true, ingredients: true, comments: { include: { user: true } } };

async function getAllPublic({ search, categoryId } = {}) {
    return prisma.recipe.findMany({
        where: {
            isPublic: true,
            ...(categoryId ? { categoryId: Number(categoryId) } : {}),
            ...(search ? {
                OR: [
                    { title: { contains: search } },
                    { ingredients: { some: { name: { contains: search } } } },
                ],
            } : {}),
        },
        include,
        orderBy: { createdAt: 'desc' },
    });
}

async function getByUser(userId) {
    return prisma.recipe.findMany({ where: { userId }, include, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
    return prisma.recipe.findUnique({ where: { id: Number(id) }, include });
}

async function create({ title, description, imagePath, isPublic, userId, categoryId, ingredients }) {
    return prisma.recipe.create({
        data: {
            title, description, imagePath, isPublic, userId, categoryId,
            ingredients: { create: ingredients },
        },
    });
}

async function update(id, { title, description, imagePath, isPublic, categoryId, ingredients }) {
    await prisma.ingredient.deleteMany({ where: { recipeId: Number(id) } });
    return prisma.recipe.update({
        where: { id: Number(id) },
        data: { title, description, imagePath, isPublic, categoryId, ingredients: { create: ingredients } },
    });
}

async function destroy(id) {
    return prisma.recipe.delete({ where: { id: Number(id) } });
}

async function listAll() {
    return prisma.recipe.findMany({ include, orderBy: { createdAt: 'desc' } });
}

async function importExternal({ title, description, imagePath, userId, ingredients }) {
    const firstCategory = await prisma.category.findFirst();
    return prisma.recipe.create({
        data: {
            title,
            description: description || '',
            imagePath: imagePath || null,
            isPublic: false,
            userId,
            categoryId: firstCategory?.id ?? null,
            ingredients: { create: ingredients },
        },
    });
}

module.exports = { getAllPublic, getByUser, getById, create, update, destroy, listAll, importExternal };