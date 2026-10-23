# Recipe Planer

A web app for creating and sharing recipes and planning weekly meals.

## Features

- User registration and login (passwords hashed with bcrypt, session-based auth)
- Create, edit and delete recipes with ingredients, categories and an image
- Public and private recipes
- Weekly meal plans, which can be shared publicly
- Comments on recipes
- Search external recipes through the Spoonacular API and import them
- Admin panel for managing users, recipes, comments and categories
- Interface in Latvian and English (i18next)

## Tech stack

Node.js, Express 5, EJS, MySQL 8 (Docker), Prisma ORM, Multer, i18next, Spoonacular API. MVC structure (models, views, controllers, routes, middleware).

## Running locally

Requirements: Node.js 20+, Docker, a free Spoonacular API key (https://spoonacular.com/food-api).

1. Clone the repo and install dependencies:

   ```
   git clone https://github.com/r-rudzitis/recipe-planer.git
   cd recipe-planer
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values.

3. Start the database:

   ```
   docker compose up -d
   ```

4. Create the tables and generate the Prisma client:

   ```
   npx prisma db push
   npx prisma generate
   ```

5. Start the app:

   ```
   npm start
   ```

   It runs at http://localhost:3000.

To make a user an admin, register normally and then run:

```
docker exec -it recipe-planer-db mysql -u root -p recipe_planer -e "UPDATE User SET role='admin' WHERE email='you@example.com';"
```

## Project structure

```
controllers/   request handling
models/        database access (Prisma) and the Spoonacular client
routes/        Express routes
middleware/    auth, admin check, image upload
views/         EJS templates
locales/       LV and EN translations
prisma/        database schema
public/        CSS, images, uploads
```

## Author

Rainers Rudzītis
