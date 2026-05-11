const {
  getAlerts,
  resolveAlert,
} = require("../controllers/alertController");

const { protectorMW } = require("../middlewares/authGuard");

const router = require("express").Router();

router.get("/api/alerts", protectorMW, getAlerts);

router.patch(
  "/api/alerts/:id/resolve",
  protectorMW,
  resolveAlert
);

module.exports = router;