const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");

exports.createTelemetry = async (req, res) => {
  try {
    const { truck, temperature, door_open, latitude, longitude } = req.body;

    if (!truck) {
      return res.status(400).json({
        message: "Truck id is required.",
      });
    }

    const existingTruck = await Truck.findOne({
      _id: truck,
      company: req.user.company,
    });

    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck Not Found or access denied !!!",
      });
    }

    const newTelemetry = await Telemetry.create({
      truck,
      temperature,
      door_open,
      latitude,
      longitude,
    });

    existingTruck.lastSeen = Date.now();
    await existingTruck.processTelemetryAlerts(temperature, door_open);
    await existingTruck.save();

    return res.status(201).json({
      message: "Telemetry Created Successfully !!!",
      data: newTelemetry,
    });
  } catch (error) {
    console.error("createTelemetry error:", error.message);
    return res.status(400).json({
      message: "Unable to create telemetry.",
    });
  }
};

exports.getTelemetryByTruck = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const truck = await Truck.findOne({ _id: req.params.truckId, company: req.user.company });
    if (!truck) {
      return res.status(404).json({
        message: "Truck Not Found or access denied !!!",
      });
    }

    const telemetry = await Telemetry.find({
      truck: req.params.truckId,
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Telemetry Fetched Successfully !!!",
      data: telemetry,
    });
  } catch (error) {
    console.error("getTelemetryByTruck error:", error.message);
    return res.status(400).json({
      message: "Unable to fetch telemetry.",
    });
  }
};
