const prisma = require('./prisma');

async function createComment({ body, userId, recipeId }) {
    return prisma.comment.create({ data: { body, userId, recipeId: Number(recipeId) } });
}

async function findById(id) {
    return prisma.comment.findUnique({ where: { id: Number(id) } });
}

async function deleteComment(id) {
    return prisma.comment.delete({ where: { id: Number(id) } });
}

async function listAll() {
    return prisma.comment.findMany({ include: { user: true, recipe: true }, orderBy: { createdAt: 'desc' } });
}

module.exports = { createComment, deleteComment, findById, listAll };