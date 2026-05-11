const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.ObjectId,
    ref: "Truck",
    required: true,
  },

  type: {
    type: String,
    enum: [
      "TEMP_HIGH",
      "TEMP_LOW",
      "DOOR_OPEN",
      "TRUCK_OFFLINE",
    ],
    required: true,
  },

  severity: {
    type: String,
    enum: ["WARNING", "CRITICAL"],
    default: "WARNING",
  },

  message: {
    type: String,
  },

  resolved: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;