> **WE ARE HIRING:** [Apply Now](https://www.knawat.com/career/).

# Back-End Developer - Node.js
### Serkan Gündüz
### 05398403001
### serkan.gunduz@hosted.com.tr
### https://github.com/srkn-gndz


## To-Dos
- [x] build a simple set of services with [Moleculer]
- [x] using Redis as a caching system
- [x] You have to use any messaging system for services transportation, RabbitMQ, NATs. (I used NATs as messaging system for services transportation)
- [x] This services should have an API layer for the required functionality listed below.
- [x] User can log in & register
- [x] User can add products to the cart.
- [x] User can get his cart summary.
- [x] Use Elasticsearch as a database.
- [x] Unit test with 100% coverage is a required.
- [x] Should use TypeScript.
- [x] Each service should run in a separate container.
- [x] Redis, and Elasticsearch each in a separate container.
- [x] Project should run with docker-compose.
- [x] Explain how to run the application
- [x] Required environments
- [x] Any extra information


# how to run the application
## Install dependencies
```bash
$ npm i
```

## Development
**to run containers with docker**
```bash
$ npm run dc:up
```

## Test
```bash
$ npm run test
```

<strong>TL;DR,</strong> This challenge expects you to build a simple set of services with [Moleculer](https://moleculer.services/) Framework, using Redis as a caching system, and any messaging systems as service transporter.
This services should have an API layer for the required functionality listed below.

## Evaluation criteria:

In addition to the functionality, we will also evaluate the code style, code structure, project documentation, tests, Git messages, code linting, and ease of setup.

## Functionality:

- User can log in & register.
- User can add products to the cart.
- User can get his cart summary.

## Backend:

- Use Elasticsearch as a database.
- Unit test with 100% coverage is a required.
- You have to use any messaging system for services transportation, RabbitMQ, NATs, Mosquitto ... etc.
- Should use TypeScript.

## Docker:

- Each service should run in a separate container.
- Redis, and Elasticsearch each in a separate container.
- Whatever Messaging system you going to use, it also needs separate container.
- Project should run with docker-compose.

## Readme:

- Explain how to run the application
- Required environments
- Any extra information is PLUS

## How to submit?

Clone this repo and create a pull request once you feel the code is ready.
