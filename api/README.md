# Task Manager API

NestJS backend for the Task Manager assignment. See the [root README](../README.md) for prerequisites, environment settings, and setup instructions.

Run commands from this directory:

```sh
npm ci
# Copy .env.example to .env (see root README for your operating system).
npm run start:dev
```

The default server address is `http://localhost:3001`. `GET /` returns `{"status":"ok"}`. The five task endpoints are available at `/tasks` and `/tasks/:id`; see the root README for request fields, response codes, and error behavior. Tasks are stored in memory and reset on server restart.
