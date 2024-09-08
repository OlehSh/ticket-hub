## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```
create `.env` file from .env.example and fill it with your data
## Setup database
Before nex step please install docker and docker compose
```bash
npm run docker:run-db
````
## Run migrations
```bash
npm run prisma:migration:run
```

## Run seed
```bash
npm run prisma:seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
