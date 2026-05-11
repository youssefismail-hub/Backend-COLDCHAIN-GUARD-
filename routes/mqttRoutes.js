const { getMqtts, createMqtt } = require("../controllers/mqttController");
const router = require("express").Router();

router.get("/api/mqtt", getMqtts);
router.post("/api/mqtt", createMqtt);

module.exports = router;
