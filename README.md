# Template

## Description

Template

## Installation

```bash
$ yarn install
```

## Configuration

Create `.env` file and set the environment variables.

```bash
$ cp .env.example .env
```

Setup Git hooks.

```bash
$ yarn prepare
```

## Running

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

The application will be available at http://localhost:3000.

## Testing

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
