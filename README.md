# Start Application

First start docker containers
```shell
docker compose up -d
```

To start backend run:
```shell
docker compose exec backend /bin/bash # enter "backend" container
npm install
npm run start:dev
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
