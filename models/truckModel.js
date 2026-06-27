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

truckSchema.methods.processTelemetryAlerts = async function (temperature, door_open) {
  const Alert = mongoose.model("Alert");

  const previousStatus = this.status;
  // Reset status for this evaluation; will be upgraded below if breach found
  this.status = "OK";

  if (temperature > this.max_temperature) {
    this.status = "CRITICAL";
    // Only create a new alert if we weren't already critical (avoids spam)
    if (previousStatus !== "CRITICAL") {
      await Alert.create({
        truck: this._id,
        type: "TEMP_HIGH",
        severity: "CRITICAL",
        message: `Temperature ${temperature}°C exceeds maximum limit of ${this.max_temperature}°C`,
      });
    }
  } else if (temperature < this.min_temperature) {
    this.status = "CRITICAL";
    if (previousStatus !== "CRITICAL") {
      await Alert.create({
        truck: this._id,
        type: "TEMP_LOW",
        severity: "CRITICAL",
        message: `Temperature ${temperature}°C is below minimum limit of ${this.min_temperature}°C`,
      });
    }
  }

  if (door_open === true) {
    // Only upgrade to WARNING if not already at a higher severity
    if (this.status !== "CRITICAL") this.status = "WARNING";
    if (previousStatus !== "WARNING" && previousStatus !== "CRITICAL") {
      await Alert.create({
        truck: this._id,
        type: "DOOR_OPEN",
        severity: "WARNING",
        message: "Truck door is open",
      });
    }
  }
};

const Truck = mongoose.model("Truck", truckSchema);

module.exports = Truck;