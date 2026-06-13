# Start Application

First start docker containers
```shell
docker compose up -d
```

To start backend run:
```shell
docker compose exec backend /bin/bash # enter "backend" container
npm install
node ./scripts/setup-development-dotenv.js # will auto-generate .env file (for development environment)
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

To start frontend run:
```shell
docker compose exec frontend /bin/bash # enter "frontend" container
npm install
cp .env.sample .env
npm run dev
```

During development to generate api client hooks then run the following in "frontend" directory:
```shell
# Important!!: make sure to run it inside the Docker container
# OR update "API_OPENAPI_JSON_URL" to localhost if you want to run it in your local machine
npm run generate:api-client
```

To stop docker containers run
```shell
docker compose down
```

# Prisma
running new migration
```shell
npx prisma migrate dev --name init
```

generate the Prisma Client
```shell
npx prisma generate
```
