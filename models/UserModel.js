const prisma = require('./prisma');

async function createUser({ name, email, passwordHash, role = 'user' }) {
    return prisma.user.create({ data: { name, email, passwordHash, role } });
}

async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

async function findUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}

async function listUsers() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

async function deleteUser(id) {
    return prisma.user.delete({ where: { id } });
}

module.exports = { createUser, findUserByEmail, findUserById, listUsers, deleteUser };