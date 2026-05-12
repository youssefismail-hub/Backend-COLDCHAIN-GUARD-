const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  rejectUnauthorized: true,
});

client.on("connect", () => {
  console.log(" Connected to MQTT Broker");
});

client.on("error", (err) => {
  console.log("MQTT Error:", err);
});

module.exports = client;