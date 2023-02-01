# Simple NestJS Auth

Boilerplate authorization/authentication built on [Nest](https://github.com/nestjs/nest)

Features:

- Prisma ORM
- Config validation using Joi
- JWT
- API endpoints: login, logout, register, get current user
- Asymmetric JWT signing using RSA with SHA-256
- Refresh token rotation
- Refresh token reuse detection

## Installation

```bash
$ npm install
```

## Configuration

Configuration is provided in a .env file

```dotenv
LISTEN_HOST=0.0.0.0
LISTEN_PORT=3000

DATABASE_URL="postgresql://sleepyplov:qwerty@localhost:5432/t2tlocal?schema=public"

JWT_KEYS_PATH=./jwt_keys/
JWT_EXPIRE=15m
JWT_AUDIENCE=auth.example.com
JWT_ISSUER=auth.example.com
```

JWT_KEYS_PATH is the path to RSA keys used to sign access tokens. Must be named public.pem and private.pem.

JWT_EXPIRE is a number of seconds or a string in the format used by [vercel/ms](https://github.com/vercel/ms). 

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [MIT licensed](LICENSE).
