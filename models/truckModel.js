const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Truck name is required !!!"],
  },

  plate_number: {
    type: String,
    required: [true, "Plate number is required !!!"],
    unique: true,
  },

  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: [true, "Truck must belong to a company !!!"],
  },

  min_temperature: {
    type: Number,
    required: [true, "Minimum temperature is required !!!"],
  },

  max_temperature: {
    type: Number,
    required: [true, "Maximum temperature is required !!!"],
  },

  status: {
    type: String,
    enum: ["OK", "WARNING", "CRITICAL", "OFFLINE"],
    default: "OFFLINE",
  },

  lastSeen: {
    type: Date,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;