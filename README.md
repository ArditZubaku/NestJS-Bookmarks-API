# NestJS Bookmarks API
<p >
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

This repository contains a powerful and efficient Bookmarks API built using NestJS, a progressive Node.js framework. The API allows users to manage bookmarks with ease and provides various features to enhance the bookmarking experience.

## Features

- **User Authentication**: The API utilizes JWT-based authentication powered by `@nestjs/jwt` and `passport-jwt`. Users can register, log in, and access their personalized bookmarks securely.

- **Bookmark Management**: Users can perform CRUD operations on their bookmarks. The API employs `@nestjs/common` for routing and controllers, making it easy to handle bookmark operations.

- **Prisma ORM Integration**: Database operations are efficiently managed with the help of `@prisma/client`, which provides a type-safe ORM layer.

## Installation

1. Clone this repository to your local machine.
2. Install the required dependencies by running:

```bash
$ yarn install
```
or

```bash
$ npm install
```

## Configuration

Before running the application, ensure that you have set up the required configuration:

1. **Database Configuration**: The API uses Prisma as an ORM, so you need to set up the database configuration. Rename the `.env.example` file to `.env` and update it with your database credentials.

2. **JWT Secret**: Update the `.env` file with a secure JWT secret for token generation and validation.

## Database Setup

To set up the database and run migrations, execute the following commands:

```bash
$ yarn db:dev:restart        # start postgres in docker and push migrations
```


## Running the API

Start the API in development mode by running:


```bash
# watch mode
$ yarn start:dev
```
or

```bash
# watch mode
$ npm run start:dev
```

The API will be accessible at `http://localhost:3333`.

## Testing

The API is thoroughly tested using Jest. To run the test suite, use the following command:

```bash
$ yarn test:e2e        # will setup the test database too
```
