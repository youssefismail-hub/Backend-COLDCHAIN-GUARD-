const client = require("./mqttClient");
const topics = require("./mqttTopics");

const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");
const Alert = require("../models/alertModel");

client.subscribe(topics.TELEMETRY);

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    const { truckId, temperature, door_open, latitude, longitude } = data;

    const truck = await Truck.findById(truckId);

    if (!truck) return;

    //  Save telemetry
    await Telemetry.create({
      truck: truckId,
      temperature,
      door_open,
      latitude,
      longitude,
    });

    //  Update lastSeen
    truck.lastSeen = Date.now();

    //  Alert Logic
    if (temperature > truck.max_temperature) {
      await Alert.create({
        truck: truckId,
        type: "TEMP_HIGH",
        severity: "CRITICAL",
        message: "Temperature exceeds maximum limit !!!",
      });
      truck.status = "CRITICAL";
    }

    if (temperature < truck.min_temperature) {
      await Alert.create({
        truck: truckId,
        type: "TEMP_LOW",
        severity: "CRITICAL",
        message: "Temperature below minimum limit !!!",
      });
      truck.status = "CRITICAL";
    }

    if (door_open === true) {
      await Alert.create({
        truck: truckId,
        type: "DOOR_OPEN",
        severity: "WARNING",
        message: "Truck door is open !!!",
      });
      truck.status = "WARNING";
    }

    await truck.save();

    console.log(" Telemetry received via MQTT");
  } catch (error) {
    console.log("MQTT Processing Error:", error.message);
  }
});