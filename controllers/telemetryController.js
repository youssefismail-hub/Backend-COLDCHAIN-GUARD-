const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");

exports.createTelemetry = async (req, res) => {
  try {
    const { truck, temperature } = req.body;

    // vérifier si le truck existe
    const existingTruck = await Truck.findById(truck);

    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    const newTelemetry = await Telemetry.create(req.body);

    // ✅ mettre à jour lastSeen automatiquement
    existingTruck.lastSeen = Date.now();
    existingTruck.status = "OK";
    await existingTruck.save();

    return res.status(201).json({
      message: "Telemetry Created Successfully !!!",
      data: newTelemetry,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getTelemetryByTruck = async (req, res) => {
  try {
    const telemetry = await Telemetry.find({
      truck: req.params.truckId,
    }).sort({ timestamp: -1 });

    return res.status(200).json({
      message: "Telemetry Fetched Successfully !!!",
      results: telemetry.length,
      data: telemetry,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};