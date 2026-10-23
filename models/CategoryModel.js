const prisma = require('./prisma');

async function getAll() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

async function create(name) {
    return prisma.category.create({ data: { name } });
}

async function update(id, name) {
    return prisma.category.update({ where: { id: Number(id) }, data: { name } });
}

async function destroy(id) {
    return prisma.category.delete({ where: { id: Number(id) } });
}

module.exports = { getAll, create, update, destroy };