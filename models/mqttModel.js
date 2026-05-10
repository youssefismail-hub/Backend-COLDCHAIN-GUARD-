const mongoose = require("mongoose");

const mqttSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: [true, "Device ID is required !!!"],
  },

  temperature: {
    type: Number,
    required: [true, "Temperature is required !!!"],
  },

  humidity: {
    type: Number,
    required: [true, "Humidity is required !!!"],
  },

  timestamp: {
    type: Date,
    default: Date.now, 
  },

  company_id: {
    type: String,
    default: "Unknown",
  },
});

const Mqtt = mongoose.model("Mqtt", mqttSchema);

module.exports = Mqtt;