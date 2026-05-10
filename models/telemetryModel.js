const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.ObjectId,
    ref: "Truck",
    required: [true, "Telemetry must belong to a truck !!!"],
  },

  temperature: {
    type: Number,
    required: [true, "Temperature is required !!!"],
  },

  door_open: {
    type: Boolean,
    default: false,
  },

  latitude: {
    type: Number,
  },

  longitude: {
    type: Number,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

module.exports = Telemetry;