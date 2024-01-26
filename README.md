# Community Assignment

This project was an intern assignment.

## Environment variables

All keys present in `.env.example` are compulsory at runtime. If they're not provided, then the server will not start and will crash with an error.

Create and store all the environment variables in an `.env` file.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma
- Postgresql

## Building

The project can be run using your favorite package manager with the provided scripts.

```bash
git clone
cd CommunityAssigment

yarn install
yarn build
yarn start
```

If, for some reason, you decide to run the server using `node dist/index.js`, then make sure to run `yarn prisma db push` or `npx prisma db push` before that.

## Running Locally

I have added a `Dockerfile` to the project for making it easier to host this project along with an `docker-compose.yml` file

### Running Docker Container

If you're runnign the docker container you must provide the path to `.env` file containg required environment variables mentioned in `.env.example`

```bash
# Building the image
docker build . -t assignment:latest
# Running the Container
docker run -d --name "assignment-server" --env-file .env -p "3000:3000" assignment:latest
# Stopping the container
docker stop assignment-server
```

### Running with Docker Compose

Running the project with docker-comppose will automatically handle creating and running a database container

```bash
# Starting
docker-compose up -d --build
# Stoping
docker-compose down
```
