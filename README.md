# Quiziset

A quiz web app where users can create, share and explore quizzes (I created this project as a university assignment for the course "DLBCSPJWD01" as part of my CS bachelor studies at [IUBH](https://www.iu.org))

The backend is built with [Nest.js](https://nestjs.com) and the frontend
with [Next.js](https://nextjs.org)

## Table of Contents

- [Docker Setup](#docker-setup)
- [IDE & Husky Setup](#ide--husky-setup)
- [Start Backend (inside Docker)](#start-backend-inside-docker)
- [Start Frontend (inside Docker)](#start-frontend-inside-docker)
- [App Urls](#app-urls)
- [Stop App](#stop-app)
- [GitHub CI](#github-ci)
- [Re-run Prisma Seed Dummy Data](#re-run-prisma-seed-dummy-data)
- [Guidelines regarding Backend development](#guidelines-regarding-backend-development)
- [Guidelines regarding Frontend development](#guidelines-regarding-frontend-development)
- [Coding Conventions](#coding-conventions)

## Docker Setup

The whole app runs inside Docker

- First make sure that Docker is installed in your machine
  - [Install Docker Desktop on Mac](https://docs.docker.com/desktop/setup/install/mac-install)
  - [Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- Then start all the docker containers
  ```shell
  docker compose up -d
  ```
- Now proceed to steps below to "**Start Backend**" and "**Start Frontend**"

## IDE & Husky Setup

Run the following npm installs on your local machine (i.e. this step should be done outside Docker)

- First make sure that Node.js & NPM are installed on your local machine
  - **node >= v24.15.0** (you can install it from
    here https://nodejs.org/en/download)
  - **npm >= v11.12.1** (it is installed automatically with the Node.js
    installation)
- Then run `npm install` in three places:
  - `backend` and `frontend` directories so your IDE gets the TypeScript types
    (autocomplete and type checking)
  - the root directory so Husky installs and sets up the git hooks

> **info!!:** btw below on "Start Backend" & "Start Frontend" sections you'll
> also run `npm install` in Docker backend/frontend containers too (as
> `node_modules` aren't mounted to the local machine for performance)

## Start Backend (inside Docker)

- First enter the "**backend**" Docker container
  ```shell
  docker compose exec backend /bin/bash
  ```
- Install NPM packages (**info:** as I mentioned earlier `node_modules` aren't
  mounted to the local machine for performance... so you have to install them in
  the container too)
  ```shell
  npm install
  ```
- Setup local `.env` file
  ```shell
  npm run generate:dotenv
  ```
- Generate Prisma Client
  ```shell
  npx prisma generate
  ```
- Run database migrations
  ```shell
  npx prisma migrate dev
  ```
- Seed the database with test data (for local setup only)
  ```shell
  npx prisma db seed
  ```

Finally start the backend **(inside Docker)**:

- For **Development mode** (watch and auto reload)
  ```shell
  npm run dev
  ```
- For **Production mode**
  ```shell
  npm run build
  npm run start:prod
  ```

Then you can check the API Swagger Docs here: http://localhost:4004/api-docs

## Start Frontend (inside Docker)

- First enter the "**frontend**" Docker container
  ```shell
  docker compose exec frontend /bin/bash
  ```
- Install NPM packages (**info:** as I mentioned earlier `node_modules` aren't
  mounted to the local machine for performance... so you have to install them in
  the container too)
  ```shell
  npm install
  ```
- Setup local `.env` file
  ```shell
  cp .env.sample .env
  ```

Finally start the frontend **(inside Docker)**:

- For **Development mode** (watch and auto reload)
  ```shell
  npm run dev
  ```
- For **Production mode**
  ```shell
  npm run build
  npm run start
  ```

Then open http://localhost:3003

btw if you ran the **prisma seed in the Backend step** then in frontend you can login on http://localhost:3003/login via

- email: see `SEED_DUMMY_USER_EMAIL` in `backend/.env`
- password: see `SEED_DUMMY_USER_PASSWORD` in `backend/.env`

which is a dummy account created by Prisma Seed command for local setup only

Otherwise, you can create a new account on the Sign Up page http://localhost:3003/signup

## App Urls

> **info!!:** these Docker ports are exposed to your local machine but some of
> them mapped to non-standard ports (e.g. MySQL is mapped to `3308` instead of
> the default `3306`) so you can run this project without conflicting with
> the other existing apps/databases you already have running :)

| Service             | Url                                 | What it is                                                                                     |
| ------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Frontend            | http://localhost:3003               | Next.js app                                                                                    |
| Backend             | http://localhost:4004               | Nest.js api                                                                                    |
| Backend API Docs    | http://localhost:4004/api-docs      | browse the Backend REST API docs using Swagger UI                                              |
| OpenAPI json        | http://localhost:4004/api-docs-json | used by [Orval](https://www.npmjs.com/package/orval) (to auto-generate api client in frontend) |
| MySQL               | localhost:3308                      | database                                                                                       |
| phpMyAdmin          | http://localhost:8082               | UI to browse the MySQL database (dev only)                                                     |
| MailCatcher (Inbox) | http://localhost:1080               | inbox to view sent emails (dev only)                                                           |
| MailCatcher (SMTP)  | localhost:1025                      | SMTP server that backend sends mails using it (dev only)                                       |

## Stop App

To quit the whole app you can just stop all the docker containers

```shell
docker compose down
```

## Github CI

See https://github.com/amjedomar/quiziset/actions

on every push to GitHub the CI runs ESLint, builds the app, and runs the Jest unit tests for both
backend and frontend

## Re-run Prisma Seed Dummy Data

In case you wanna **re-run** the prisma seed command (i.e. reset back to the default DB dummy data for local setup)

- First enter the "**backend**" Docker container
  ```shell
  docker compose exec backend /bin/bash
  ```
- Then you'll have to clear up all the current DB data by running the following command (**Caution:** this is ok for local setup only but not on real live production since all data on database will be lost)
  ```shell
  npx prisma migrate reset --force
  ```
- Then run the prisma seed command
  ```shell
  npx prisma db seed
  ```

## Guidelines regarding Backend development

- **Prisma**
  - We use Prisma with MySQL
  - The schema lives in `backend/prisma/schema.prisma`
  - After you change the schema: run `npx prisma generate` and create a
    migration with `npx prisma migrate dev` (please make sure to run these
    commands inside the "backend" docker container)

- **Nest.js Controller method names** (i.e. those files that ends with
  `*.controller.ts`)
  - The method name in a controller must include the resource name
  - For example name it `createQuiz` not `create`
  - Why? the method name is used as the `operationId` in the OpenAPI
    json http://localhost:4004/api-docs-json
  - [Orval](https://www.npmjs.com/package/orval) then uses that `operationId` to name the generated React hook in the
    frontend
  - So a clear method name (in the `*.controller.ts` in backend) gives a clear
    hook name (in the frontend)

- **Auth**
  - The `AuthGuard` is registered globally so every route is protected by
    default
  - For a public route add the `@IsPublic()` decorator on the controller
    method
  - To get the logged-in user inside a controller method use the `@AuthUser()`
    param decorator (it gives you the `userId`)

- **Nest.js Modules**
  - Each API feature is a module under `backend/src/modules`
  - A Nest.js module folder has the three files `*.controller.ts` `*.service.ts`
    `*.module.ts` plus `dto` and `entities` folders

- **Validation**
  - We use `class-validator` decorators in the `dto` files to validate incoming
    request data
  - e.g. put `@IsString()` on a dto property so an invalid
    request is rejected automatically

## Guidelines regarding Frontend development

- **Generated api client**
  - `src/generated-api-client` is auto generated by [Orval](https://www.npmjs.com/package/orval) from the
    backend OpenAPI json http://localhost:4004/api-docs-json
  - Never edit anything inside it manually
  - After the backend api changes run the following in frontend (but make sure that the
    backend is running before you run this command)
    ```shell
    npm run generate:api-client
    ```

- **proxy.ts**
  - `src/proxy.ts` is the Next.js proxy (middleware)
  - It guards routes: if a logged-out user opens a protected route it
    redirects to `/login`
  - If a logged-in user opens a guest-only route like `/login` it redirects
    to home page
  - When you add or remove a route (if it should be protected or guest-only) then update both the `ROUTES` object and the
    `config.matcher` in this `proxy.ts` file
- **UI / Styling**
  - we use `mui/joi` https://v7.mui.com/joy-ui/getting-started/usage
  - but for custom styles you can create `*.module.scss` file then code it using SCSS
- **Forms:** We use `react-hook-form` with `zod` for validation

## Coding Conventions

- **File structure**
  - Each TS file is wrapped in its own directory with an `index.ts` that
    re-exports it
  - The exception is the backend `modules` folder because a Nest.js module
    holds more
    than one file (service, controller, module)

- **ESLint and Prettier:** Both run automatically on commit through the Husky
  pre-commit hook

- **Git commit messages:** We follow Conventional Commits
  (see https://www.conventionalcommits.org/en/v1.0.0/) but currently their
  website seems to be down not sure why... so instead you can check this
  guide https://gist.github.com/amjedomar/f3663190c7e5304bfd5ca56db537638f
  (which is btw a fork I did from another Gist just so this link stays a
  permalink). Examples:
  ```
  feat(backend): implement password reset logic
  fix(frontend): improve quiz overview page design
  feat(backend|frontend): implement quiz reviews
  test(frontend): added unit test for auth components
  chore(frontend): AUTO-GENERATE orval api hooks for password reset
  docs(backend|frontend): update README.md
  ```
