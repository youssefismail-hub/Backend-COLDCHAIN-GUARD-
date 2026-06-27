const client = require("./mqttClient");
const topics = require("./mqttTopics");

const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");
const Alert = require("../models/alertModel");
const socket = require("../socket");
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
    await truck.processTelemetryAlerts(temperature, door_open);

    await truck.save();

    console.log(" Telemetry received via MQTT");
       // TEMPS RÉEL (Socket.io)
    const io = socket.getIO();

    const companyId = truck.company.toString();

    io.to(companyId).emit("telemetry_update", {
      truckId: truck._id,
      temperature,
      status: truck.status,
      door_open,
      timestamp: new Date(),
    });
  } catch (error) {
    console.log("MQTT Processing Error:", error.message);
  }
});