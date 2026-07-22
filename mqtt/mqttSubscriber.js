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

    const truckId = data.truckId;
    const temperature = data.temperature;
    const door_open = data.door_open === true;
    const latitude = data.latitude;
    const longitude = data.longitude;

    if (!truckId || temperature === undefined) return;

    const truck = await Truck.findById(truckId);

    if (!truck) return;

    //  Save telemetry (whitelisted fields only)
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

    console.log("Telemetry received via MQTT");
       // TEMPS RÉEL (Socket.io)
    const io = socket.getIO();

    const companyId = truck.company.toString();

    io.to(companyId).emit("telemetry_update", {
      truckId: truck._id,
      temperature,
      status: truck.status,
      door_open,
      latitude,
      longitude,
      timestamp: new Date(),
    });
  } catch (error) {
    console.log("MQTT Processing Error:", error.message);
  }
});