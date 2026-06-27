const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
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
app.use(express.json());

// Enable CORS — restrict to explicit origin in production
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
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
const port = 1234;
//  Create HTTP Server
const server = http.createServer(app);

//  Initialize Socket.io
const socket = require("./socket");
socket.init(server);

server.listen(port, () => {
  console.log("The server is running on Port: " + port);
});
