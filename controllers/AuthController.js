const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

async function showRegister(req, res) {
    res.render('auth/register', { user: req.session.user || null, error: null });
}

async function register(req, res) {
    const { name, email, password } = req.body;
    try {
        const existing = await UserModel.findUserByEmail(email);
        if (existing) {
            return res.render('auth/register', {
                user: req.session.user || null,
                error: 'Email already in use.',
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await UserModel.createUser({ name, email, passwordHash });
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { user: null, error: 'Something went wrong.' });
    }
}

async function showLogin(req, res) {
    res.render('auth/login', { user: req.session.user || null, error: null });
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const found = await UserModel.findUserByEmail(email);
        if (!found) {
            return res.render('auth/login', { user: null, error: 'Invalid email or password.' });
        }
        const match = await bcrypt.compare(password, found.passwordHash);
        if (!match) {
            return res.render('auth/login', { user: null, error: 'Invalid email or password.' });
        }
        req.session.user = { id: found.id, name: found.name, role: found.role };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('auth/login', { user: null, error: 'Something went wrong.' });
    }
}

function logout(req, res) {
    req.session.destroy(() => res.redirect('/'));
}

module.exports = { showRegister, register, showLogin, login, logout };