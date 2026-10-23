require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const RecipeController = require('./controllers/RecipeController');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const mealPlanRoutes = require('./routes/mealplans');
const adminRoutes = require('./routes/admin');


const externalRoutes = require('./routes/external');


const app = express();

// i18next
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        backend: { loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json') },
        fallbackLng: 'en',
        preload: ['en', 'lv'],
    });

app.use(middleware.handle(i18next));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'changeme',
    resave: false,
    saveUninitialized: false,
}));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Language switcher
app.get('/lang/:lng', (req, res) => {
    req.session.lng = req.params.lng;
    req.i18n.changeLanguage(req.params.lng);
    const referer = req.headers.referer;
    if (referer && !referer.includes('/lang/')) {
        res.redirect(referer);
    } else {
        res.redirect('/');
    }
});

// Globals for all views
app.use((req, res, next) => {
    const lng = req.session.lng || 'en';
    req.i18n.changeLanguage(lng);
    res.locals.t = req.t.bind(req);
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);
app.use('/admin', adminRoutes);
app.use('/recipes/:recipeId/comments', commentRoutes);
app.use('/mealplans', mealPlanRoutes);
app.use('/external', externalRoutes);
app.get('/', RecipeController.index);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));