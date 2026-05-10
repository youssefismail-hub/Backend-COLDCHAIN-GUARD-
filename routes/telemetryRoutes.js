const {
  createTelemetry,
  getTelemetryByTruck,
} = require("../controllers/telemetryController");

const { protectorMW } = require("../middlewares/authGuard");

const router = require("express").Router();

router.post("/api/telemetry", createTelemetry); 


router.get(
  "/api/telemetry/:truckId",
  protectorMW,
  getTelemetryByTruck
);

module.exports = router;