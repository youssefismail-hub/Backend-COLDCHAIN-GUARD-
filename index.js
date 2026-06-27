const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const truckRoutes = require("./routes/truckRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const companyRoutes = require("./routes/companyRoutes");
const alertRoutes = require("./routes/alertRoutes");
const http = require("http");

dotenv.config({ path: "./.env" });



mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    require("./mqtt/mqttSubscriber");
    console.log("Connection to the DB secured !!!");
  })
  .catch((e) => {
    console.log("Error: " + e);
  });

const app = express();
app.use(helmet());
app.use(express.json());

const { getAllowedOrigins } = require("./socket");
const allowedOrigins = getAllowedOrigins();

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins === "*") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

const telemetryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000,           // allow high-frequency IoT sensors
  message: { message: "Telemetry rate limit exceeded." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes (strict limit)
app.use("/api/signIn", authLimiter);
app.use("/api/signUp", authLimiter);

// Telemetry ingestion (IoT-friendly limit)
app.use("/api/telemetry", telemetryLimiter);

// All other API routes
app.use("/api", apiLimiter);

app.use(userRoutes);
app.use(truckRoutes);
app.use(telemetryRoutes);
app.use(alertRoutes);
app.use(companyRoutes);

// Global error handler — catches unhandled errors from all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message, err.stack);
  res.status(500).json({ message: "Internal server error." });
});

const port = 1234;
//  Create HTTP Server
const server = http.createServer(app);

//  Initialize Socket.io
const socket = require("./socket");
socket.init(server);

server.listen(port, () => {
  console.log("The server is running on Port: " + port);
});
