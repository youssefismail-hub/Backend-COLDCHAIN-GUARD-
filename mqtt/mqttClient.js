const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("✅ Connected to MQTT Broker");
});

client.on("error", (err) => {
  console.log("MQTT Error:", err);
});

module.exports = client;