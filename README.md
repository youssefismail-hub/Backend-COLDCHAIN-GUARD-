# Backend - COLDCHAIN GUARD

A Node.js backend for a cold-chain telemetry and alerting system. It ingests telemetry (via HTTP and MQTT), stores telemetry and domain data in MongoDB, exposes REST APIs for users, trucks, telemetry, companies and alerts, and provides real-time notifications to clients via Socket.IO.

## Features
- Telemetry ingestion (HTTP endpoint + MQTT subscriber)
- User authentication and authorization (JWT + bcrypt)
- Truck, company, telemetry and alert management (Mongoose models)
- Real-time notifications via Socket.IO
- Rate limiting tuned for auth, telemetry ingestion, and general API traffic
- Input sanitization utilities

## Stack
- Language(s): JavaScript (Node.js)
- Framework / runtime: Express (Node.js, CommonJS)
- Notable libraries: mongoose (MongoDB), mqtt (MQTT client), socket.io (real-time), express-rate-limit, jsonwebtoken, bcryptjs

## Repository layout
```
index.js                     Application entry — DB connect, middleware, rate limits, route mounting, socket init
socket.js                    Socket.IO init + CORS helpers
.env.example                 Example environment variables
package.json                 npm scripts & dependencies

controllers/                 Route handlers (auth, user, truck, telemetry, alert, company)
routes/                      Express route definitions that mount controllers
models/                      Mongoose models (User, Truck, Telemetry, Alert, Company)
mqtt/                        MQTT client/subscriber and topic definitions
middlewares/                 Express middleware (auth guard)
utils/                       Helpers (input sanitization)
```

## How it fits together
- `index.js` connects to MongoDB using `process.env.DATABASE`. On successful connection it requires `mqtt/mqttSubscriber` to start MQTT subscriptions and then starts the HTTP server and Socket.IO instance.
- Express middleware includes Helmet, JSON body parsing, CORS handling based on allowed origins from `socket.js`, and three rate-limiters: auth routes, telemetry ingestion, and general API.
- Routes in `routes/*.js` use controllers in `controllers/*.js`, which use Mongoose models in `models/*.js` to persist and query data.
- MQTT consumer (`mqtt/mqttSubscriber.js`) subscribes to telemetry topics and forwards incoming data into the same pipeline used by HTTP telemetry ingestion. Socket.IO notifies connected clients in real time.

## Getting started
### Prerequisites
- Node.js (LTS recommended)
- A running MongoDB instance or Atlas URI
- An MQTT broker (optional if you only use HTTP ingestion)

### Quickstart
```bash
# 1. Copy environment template and edit
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Run in development (auto-reload with nodemon)
npm run dev

# or production
npm start
```

The server listens on port `1234` (configured in `index.js`).

### Available npm scripts
- `npm start` — run `node index.js`
- `npm run dev` — run `nodemon index.js`

## Environment variables
Copy `.env.example` to `.env` and fill in values. Important variables:

```
# MongoDB connection string
DATABASE=mongodb+srv://<user>:<password>@<cluster>/<dbname>

# MQTT broker
MQTT_BROKER=mqtt://localhost:1883
MQTT_USERNAME=
MQTT_PASSWORD=

# Auth
JWT_SECRET=<generate-a-long-random-string>

# CORS + Socket.IO — comma-separated frontend origins (no trailing slash)
# Example: http://localhost:3000,http://192.168.1.5:3000
ALLOWED_ORIGIN=http://localhost:3000
```

Provide at least `DATABASE` and `JWT_SECRET`. If you use MQTT, also set `MQTT_BROKER` and credentials as needed.

## API overview
Routes are defined in `routes/*.js` and implemented in `controllers/*.js`. Notable endpoints (see route files for full details):

- POST `/api/signIn` — sign in (rate-limited)
- POST `/api/signUp` — sign up (rate-limited)
- POST `/api/telemetry` — ingest telemetry (high-rate-limit for IoT sensors)
- CRUD endpoints for users, trucks, companies, and alerts via their respective routers

For accurate parameter lists and example requests/responses, review `routes/*` and `controllers/*` files.

## MQTT
- `mqtt/mqttSubscriber.js` subscribes to configured topics and integrates telemetry/alerts into the system.
- `mqtt/mqttClient.js` sets up the MQTT client connection.
- `mqtt/mqttTopics.js` lists topic names used by the system.

## Socket.IO
Socket.IO is initialized in `socket.js` and attached to the same HTTP server. Allowed origins for CORS are read from the environment and used for both HTTP CORS handling and Socket.IO.

## Development notes & TODOs
- Add detailed API documentation with request/response examples and status codes.
- Add environment variable documentation (this README includes the basics, but individual controllers may require additional variables).
- Add unit & integration tests and CI configuration.
- Consider adding a Dockerfile and docker-compose for local development (MongoDB + MQTT broker + app).

## Contributing
Contributions are welcome. Open issues or PRs with proposed changes or documentation improvements.

## License
ISC
