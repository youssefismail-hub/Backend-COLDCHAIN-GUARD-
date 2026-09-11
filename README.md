# Backend - COLDCHAIN GUARD

**Enterprise-Grade IoT Telemetry & Cold-Chain Monitoring Platform**

A production-ready Node.js backend for real-time cold-chain temperature monitoring, asset tracking, and automated alerting. Designed for pharmaceutical, food, and logistics operations with high-frequency IoT sensor ingestion, multi-protocol data collection (HTTP/MQTT), and real-time WebSocket notifications.

---

## 🎯 Overview

COLDCHAIN GUARD aggregates telemetry from distributed sensors across cold-chain logistics networks, processes temperature and environmental data, manages compliance alerts, and provides REST APIs and real-time dashboards for monitoring and incident response.

**Key Use Cases:**
- Real-time temperature monitoring of refrigerated trucks and storage facilities
- Compliance violation detection and automated alerting
- Asset tracking and location-based logistics optimization
- Historical telemetry analysis and cold-chain audits

---

## ⚙️ Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js (CommonJS) | 18+ LTS |
| **Framework** | Express.js | 5.2.1 |
| **Database** | MongoDB | 7.1.0+ |
| **ODM** | Mongoose | 9.1.6+ |
| **Message Broker** | MQTT 3.1.1 | 5.15.1 |
| **Real-Time** | Socket.IO | 4.8.3 |
| **Security** | Helmet.js, bcryptjs, JWT | 8.2.0, 3.0.3, 9.0.3 |
| **Input Validation** | Validator.js | 13.15.26 |
| **Rate Limiting** | express-rate-limit | 8.5.2 |
| **Containerization** | Docker | (Alpine Node 18) |

---

## 📋 Features

### Core Capabilities
- **🔄 Multi-Protocol Telemetry Ingestion**
  - HTTP REST endpoints for synchronous data submission
  - MQTT subscriber for asynchronous IoT sensor streams
  - Unified telemetry pipeline for both ingestion methods

- **🔐 Enterprise Authentication & Authorization**
  - JWT-based stateless auth (configurable expiry)
  - bcrypt password hashing with salt rounds
  - Role-based access control (RBAC) via User models
  - Protected routes with middleware guards

- **📊 Domain Model Management**
  - **Users**: Multi-role users with auth credentials
  - **Trucks**: Cold-chain asset registry with metadata
  - **Companies**: Multi-tenant organizational hierarchy
  - **Telemetry**: High-volume sensor readings (temperature, humidity, GPS)
  - **Alerts**: Automated violation triggers and escalation rules

- **⚡ Real-Time Notifications**
  - Socket.IO broadcast for connected dashboards
  - Event-driven alert delivery
  - CORS-aware WebSocket configuration

- **🛡️ Security & Rate Limiting**
  - **Auth Limiter**: 10 attempts per 15 minutes (brute-force protection)
  - **Telemetry Limiter**: 1,000 requests/min (high-frequency IoT sensors)
  - **API Limiter**: 200 requests per 15 minutes (general endpoints)
  - Helmet.js for HTTP security headers
  - Input sanitization and XSS/SQL injection prevention

- **📦 Production-Ready Deployment**
  - Docker containerization (Alpine Linux for minimal footprint)
  - Environment-based configuration
  - Graceful error handling and logging
  - Health check support

---

## 📁 Repository Structure

```
.
├── index.js                    # Application entry point: DB init, middleware, server
├── socket.js                   # Socket.IO initialization and CORS configuration
├── package.json               # Dependencies and npm scripts
├── package-lock.json          # Dependency lock (recommended for production)
├── Dockerfile                 # Multi-stage Docker build for production
├── .env.example               # Environment variable template
│
├── controllers/               # Route handler logic (business logic)
│   ├── authController.js      # Sign-up, sign-in, token refresh
│   ├── userController.js      # User CRUD and profile management
│   ├── truckController.js     # Truck registry and fleet management
│   ├── telemetryController.js # Telemetry ingestion and queries
│   ├── alertController.js     # Alert creation, escalation, resolution
│   └── companyController.js   # Multi-tenant company management
│
├── routes/                    # Express route definitions (endpoint mapping)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── truckRoutes.js
│   ├── telemetryRoutes.js
│   ├── alertRoutes.js
│   └── companyRoutes.js
│
├── models/                    # Mongoose ODM schemas and data models
│   ├── User.js
│   ├── Truck.js
│   ├── Telemetry.js
│   ├── Alert.js
│   └── Company.js
│
├── mqtt/                      # MQTT client and subscriber configuration
│   ├── mqttClient.js          # MQTT broker connection factory
│   ├── mqttSubscriber.js      # Topic subscriptions and message handlers
│   └── mqttTopics.js          # Topic name constants and definitions
│
├── middlewares/               # Express middleware (cross-cutting concerns)
│   ├── authGuard.js           # JWT verification and auth checks
│   └── errorHandler.js        # Centralized error response formatting
│
└── utils/                     # Shared utilities and helpers
    ├── sanitizer.js           # Input sanitization (XSS, SQL injection)
    ├── validators.js          # Custom validation helpers
    └── logger.js              # Structured logging
```

---

## 🔌 Architecture & Data Flow

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     COLDCHAIN GUARD ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IoT Sensors           Frontend Dashboard         Admin Portal  │
│  (Trucks/Sites)        (Real-Time Monitoring)     (Management)  │
│        │                      │                         │       │
│        └──────────────────────┼─────────────────────────┘       │
│                               │                                 │
│                    ┌──────────▼──────────┐                     │
│                    │   MQTT Broker       │                     │
│                    │   (Event Stream)    │                     │
│                    └──────────┬──────────┘                     │
│                               │                                 │
│        ┌──────────────────────┼──────────────────────┐          │
│        │                      │                      │          │
│   ┌────▼─────┐        ┌──────▼──────┐      ┌─────────▼────┐   │
│   │   HTTP   │        │   MQTT      │      │  WebSocket   │   │
│   │ Endpoints│        │ Subscriber  │      │  (Real-time) │   │
│   └────┬─────┘        └──────┬──────┘      └─────────┬────┘   │
│        │                     │                       │         │
│        └─────────────────────┼───────────────────────┘         │
│                              │                                  │
│                      ┌───────▼────────┐                        │
│                      │  Express.js    │                        │
│                      │  Controllers   │                        │
│                      └───────┬────────┘                        │
│                              │                                  │
│                      ┌───────▼────────┐                        │
│                      │   Mongoose     │                        │
│                      │  Data Models   │                        │
│                      └───────┬────────┘                        │
│                              │                                  │
│                      ┌───────▼────────┐                        │
│                      │   MongoDB      │                        │
│                      │   (Data Lake)  │                        │
│                      └────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Request/Response Pipeline

1. **Ingestion**: HTTP POST or MQTT message arrives
2. **Authentication**: JWT verified (if protected endpoint)
3. **Rate Limiting**: Request counted against tier-specific limits
4. **Validation**: Input sanitized and schema-validated
5. **Processing**: Controller executes business logic
6. **Persistence**: Mongoose model writes to MongoDB
7. **Notification**: Socket.IO broadcasts update to connected clients
8. **Response**: JSON response returned to client

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 LTS or higher ([download](https://nodejs.org/))
- **MongoDB** 7.0+ (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **MQTT Broker** (optional; [Mosquitto](https://mosquitto.org/) or cloud MQTT service)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/youssefismail-hub/Backend-COLDCHAIN-GUARD-.git
cd Backend-COLDCHAIN-GUARD-
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Configuration](#-environment-configuration) below):

```env
# MongoDB Connection
DATABASE=mongodb+srv://user:password@cluster.mongodb.net/coldchain

# MQTT Broker (optional)
MQTT_BROKER=mqtt://mqtt.broker.com:1883
MQTT_USERNAME=your_mqtt_user
MQTT_PASSWORD=your_mqtt_password

# Security
JWT_SECRET=your-super-secret-key-min-32-chars-recommended

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:3000,http://192.168.1.100:3000
```

#### 4. Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
Connection to the DB secured !!!
The server is running on Port: 1234
```

---

## 🛠️ Development

### Available npm Scripts

```bash
npm start              # Start production server
npm run dev            # Start with auto-reload (nodemon)
npm test               # Run test suite (configure first)
```

### Example Development Workflow

```bash
# Terminal 1: Start MongoDB locally
mongod

# Terminal 2: Start MQTT broker (if using)
mosquitto

# Terminal 3: Start backend
npm run dev
```

### Common Development Tasks

#### Add a New API Endpoint

1. **Create controller** in `controllers/newFeatureController.js`:
```javascript
exports.getStatus = async (req, res) => {
  try {
    // business logic
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

2. **Create route** in `routes/newFeatureRoutes.js`:
```javascript
const express = require("express");
const { getStatus } = require("../controllers/newFeatureController");
const router = express.Router();

router.get("/api/status", getStatus);
module.exports = router;
```

3. **Register route** in `index.js`:
```javascript
app.use(require("./routes/newFeatureRoutes"));
```

#### Connect a New MQTT Topic

1. Add topic to `mqtt/mqttTopics.js`:
```javascript
exports.SENSOR_TEMPERATURE = "sensors/temperature/+";
```

2. Subscribe in `mqtt/mqttSubscriber.js`:
```javascript
client.subscribe(TOPICS.SENSOR_TEMPERATURE, (err) => {
  if (!err) console.log("Subscribed to temperature");
});
```

3. Handle messages in subscriber callback:
```javascript
client.on("message", async (topic, message) => {
  if (topic.startsWith("sensors/temperature")) {
    await handleTemperatureSensor(topic, message);
  }
});
```

---

## 📡 Environment Configuration

### Required Variables

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| `DATABASE` | URI | `mongodb+srv://user:pass@cluster/db` | MongoDB connection string |
| `JWT_SECRET` | String | `your-random-secret-min-32-chars` | Secret key for JWT signing (min 32 chars) |
| `ALLOWED_ORIGIN` | CSV | `http://localhost:3000` | Comma-separated frontend origins (no trailing slash) |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MQTT_BROKER` | URI | `mqtt://localhost:1883` | MQTT broker endpoint |
| `MQTT_USERNAME` | String | `` | MQTT broker username |
| `MQTT_PASSWORD` | String | `` | MQTT broker password |
| `NODE_ENV` | Enum | `production` | Set to `development` for verbose logging |
| `PORT` | Number | `1234` | HTTP server port (hardcoded in index.js; override if needed) |

### Security Best Practices

- **Generate strong JWT_SECRET**: `openssl rand -base64 32`
- **Use environment secrets** in CI/CD (GitHub Secrets, GitLab CI, etc.)
- **Never commit .env files** to version control
- **Rotate MQTT credentials** regularly
- **Use MongoDB Atlas IP Whitelist** to restrict connections

---

## 🔌 API Endpoints Overview

### Authentication
```
POST   /api/signUp       Create new user account
POST   /api/signIn       Authenticate and receive JWT token
POST   /api/refreshToken Refresh expired JWT token
```

### Users
```
GET    /api/users        List all users (admin only)
GET    /api/users/:id    Get user profile
PUT    /api/users/:id    Update user details
DELETE /api/users/:id    Deactivate user (admin only)
```

### Trucks (Assets)
```
GET    /api/trucks       List all trucks
POST   /api/trucks       Register new truck
GET    /api/trucks/:id   Get truck details
PUT    /api/trucks/:id   Update truck info
DELETE /api/trucks/:id   Decommission truck
```

### Telemetry
```
POST   /api/telemetry    Ingest sensor reading (HTTP)
GET    /api/telemetry    Query historical telemetry
GET    /api/telemetry/:id Get specific reading
```

### Alerts
```
GET    /api/alerts       List active/historical alerts
POST   /api/alerts       Create compliance alert
PUT    /api/alerts/:id   Update alert status
DELETE /api/alerts/:id   Resolve/close alert
```

### Companies
```
GET    /api/companies    List companies (admin)
POST   /api/companies    Create company (multi-tenant)
PUT    /api/companies/:id Update company
```

**For detailed endpoint documentation, see individual route files in `routes/*.js`**

---

## 📊 Database Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (bcrypt hashed),
  name: String,
  role: String (enum: user, admin, operator),
  company: ObjectId (ref: Company),
  createdAt: Date,
  updatedAt: Date
}
```

### Truck
```javascript
{
  _id: ObjectId,
  registrationNumber: String (unique),
  model: String,
  company: ObjectId (ref: Company),
  capacity: Number,
  currentLocation: {
    latitude: Number,
    longitude: Number
  },
  status: String (enum: active, maintenance, decommissioned),
  createdAt: Date,
  updatedAt: Date
}
```

### Telemetry
```javascript
{
  _id: ObjectId,
  truck: ObjectId (ref: Truck),
  temperature: Number (°C),
  humidity: Number (%),
  location: {
    latitude: Number,
    longitude: Number
  },
  timestamp: Date,
  source: String (enum: http, mqtt)
}
```

### Alert
```javascript
{
  _id: ObjectId,
  truck: ObjectId (ref: Truck),
  type: String (enum: temperature_high, temperature_low, humidity, gps),
  severity: String (enum: low, medium, high, critical),
  message: String,
  status: String (enum: open, acknowledged, resolved),
  createdAt: Date,
  resolvedAt: Date
}
```

---

## 🔌 MQTT Integration

### Supported Topics

| Topic | Payload | Handler |
|-------|---------|---------|
| `sensors/temperature/:truckId` | `{"temp": 5.2, "ts": 1234567890}` | Telemetry insertion + alert check |
| `sensors/humidity/:truckId` | `{"humidity": 65, "ts": 1234567890}` | Telemetry + compliance |
| `trucks/:truckId/location` | `{"lat": 22.5, "lon": 88.3}` | GPS tracking |
| `alerts/compliance` | `{"truckId": "...", "rule": "..."}` | Direct alert creation |

### Example MQTT Publisher (Python)
```python
import paho.mqtt.client as mqtt
import json
import time

client = mqtt.Client()
client.connect("mqtt://localhost", 1883, 60)

while True:
    payload = {
        "temp": 4.2,
        "humidity": 65,
        "ts": int(time.time())
    }
    client.publish("sensors/temperature/truck_001", json.dumps(payload))
    time.sleep(10)

client.loop_forever()
```

---

## ⚡ Real-Time Features (Socket.IO)

### Supported Events

**Server → Client (Broadcasts)**
```javascript
socket.on("alert:created", (alert) => {
  // New compliance alert
});

socket.on("telemetry:received", (telemetry) => {
  // New sensor reading
});

socket.on("truck:updated", (truck) => {
  // Truck status change
});
```

**Client → Server (Requests)**
```javascript
socket.emit("telemetry:subscribe", { truckId: "..." });
socket.emit("alerts:subscribe", { severity: "critical" });
```

### JavaScript Client Example
```javascript
const socket = io("http://localhost:1234", {
  auth: { token: "jwt_token_here" }
});

socket.on("alert:created", (alert) => {
  console.log("New alert:", alert);
  // Update dashboard UI
});
```

---

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t coldchain-guard:latest .
```

### Run Container
```bash
docker run -d \
  -e DATABASE=mongodb+srv://user:password@cluster/db \
  -e JWT_SECRET=your-secret \
  -e MQTT_BROKER=mqtt://broker:1883 \
  -e ALLOWED_ORIGIN=http://frontend:3000 \
  -p 1234:1234 \
  --name coldchain-backend \
  coldchain-guard:latest
```

### Docker Compose (Recommended)
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.1
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  mqtt:
    image: eclipse-mosquitto:latest
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf

  backend:
    build: .
    ports:
      - "1234:1234"
    depends_on:
      - mongodb
      - mqtt
    environment:
      DATABASE: mongodb://admin:password@mongodb:27017/coldchain
      MQTT_BROKER: mqtt://mqtt:1883
      JWT_SECRET: your-secret
      ALLOWED_ORIGIN: http://localhost:3000

volumes:
  mongodb_data:
```

Start stack:
```bash
docker-compose up -d
```

---

## 🧪 Testing

### Unit Tests (Configure First)
```bash
npm test
```

### Manual API Testing with cURL

**Sign up:**
```bash
curl -X POST http://localhost:1234/api/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Sign in:**
```bash
curl -X POST http://localhost:1234/api/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Ingest telemetry:**
```bash
curl -X POST http://localhost:1234/api/telemetry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "truck": "truck_id_here",
    "temperature": 4.5,
    "humidity": 62
  }'
```

---

## 🔐 Security Considerations

### Implemented Protections
- ✅ **JWT Authentication**: Stateless, tamper-proof tokens
- ✅ **Rate Limiting**: Prevents brute-force attacks and DDoS
- ✅ **Password Hashing**: bcryptjs with configurable salt rounds
- ✅ **Input Validation**: Schema validation + XSS/SQL injection sanitization
- ✅ **CORS Enforcement**: Whitelist-based origin validation
- ✅ **Helmet.js**: HTTP security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ **MongoDB Injection Prevention**: Mongoose schema enforcement

### Recommended Hardening

1. **Enable HTTPS in Production**:
   - Use reverse proxy (nginx, CloudFlare)
   - Install SSL/TLS certificates (Let's Encrypt)

2. **Database Security**:
   - Enable MongoDB authentication + IP whitelisting
   - Use strong passwords; rotate regularly

3. **MQTT Security**:
   - Use TLS/SSL for MQTT broker (`mqtts://` protocol)
   - Implement topic-level ACLs

4. **API Key Management**:
   - Use secrets manager (AWS Secrets Manager, HashiCorp Vault)
   - Implement API key rotation policies

5. **Logging & Monitoring**:
   - Centralized log aggregation (ELK Stack, Splunk)
   - Real-time security alerting
   - Monthly penetration testing

---

## 📈 Performance Optimization

### Rate Limiter Tuning
Adjust in `index.js` based on load testing:
```javascript
// For high-frequency IoT deployments
const telemetryLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5000,            // Increase for > 1000 sensors
});
```

### MongoDB Indexing
Create indexes on frequently queried fields:
```javascript
// In models/Telemetry.js
telemetrySchema.index({ truck: 1, timestamp: -1 });
telemetrySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL
```

### MQTT Optimization
- Use topic filtering to reduce broker load
- Implement message compression (gzip)
- Batch small messages when possible

### Node.js Optimization
- Enable HTTP/2 with `spdy` package
- Use clustering for multi-core utilization
- Monitor memory leaks with `clinic.js`

---

## 🐛 Troubleshooting

### "Connection to the DB secured" doesn't appear
- **Issue**: MongoDB connection failed
- **Solution**: Verify `DATABASE` env var, check MongoDB service, verify IP whitelist

### MQTT messages not processed
- **Issue**: Subscriber not connecting
- **Solution**: Check `MQTT_BROKER`, `MQTT_USERNAME`, `MQTT_PASSWORD`; verify broker is running

### 429 Too Many Requests
- **Issue**: Rate limit exceeded
- **Solution**: Increase `max` values in rate limiters or implement IP-based exemptions

### Socket.IO connection refused
- **Issue**: CORS misconfiguration
- **Solution**: Verify `ALLOWED_ORIGIN` matches frontend URL exactly (no trailing slash)

### High latency in telemetry pipeline
- **Issue**: Slow MongoDB or overloaded server
- **Solution**: Add database indexes, implement caching, scale horizontally with load balancer

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose ODM Guide](https://mongoosejs.com/docs/)
- [MQTT Protocol Spec](https://mqtt.org/)
- [Socket.IO Real-Time](https://socket.io/docs/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/core/security-introduction/)
- [JWT Security](https://tools.ietf.org/html/rfc7519)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/your-feature-name`
3. **Write tests** for new functionality
4. **Follow code style**: Use ESLint (if configured)
5. **Submit pull request** with clear description and test results
6. **Link related issues**: Reference issue numbers in PR description

### Areas for Contribution
- [ ] Unit & integration tests
- [ ] GraphQL API layer
- [ ] Data visualization dashboard
- [ ] Machine learning anomaly detection
- [ ] Multi-language documentation
- [ ] CI/CD pipeline automation (GitHub Actions, GitLab CI)
- [ ] Performance benchmarking suite
- [ ] Kubernetes manifests (Helm charts)

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) file for details.

**Copyright © 2024 Youssef Ismail. All rights reserved.**

---

## 👨‍💼 Author & Support

**Youssef Ismail**
- GitHub: [@youssefismail-hub](https://github.com/youssefismail-hub)
- Email: youssefismail09@gmail.com

For issues, questions, or feature requests, please open a GitHub Issue.

---

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Core telemetry ingestion (HTTP + MQTT)
- ✅ JWT authentication system
- ✅ Real-time Socket.IO notifications
- ✅ Rate limiting for IoT workloads
- ✅ Docker containerization
- ✅ Comprehensive API endpoints

### Planned Features (v1.1.0)
- 🚧 GraphQL API layer
- 🚧 Time-series optimization (InfluxDB integration)
- 🚧 Machine learning anomaly detection
- 🚧 Automated compliance reporting
- 🚧 Advanced analytics dashboard

---

**Last Updated:** September 2026  
**Status:** Production Ready
