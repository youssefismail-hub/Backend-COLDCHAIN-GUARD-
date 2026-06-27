const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");
const Alert = require("../models/alertModel");

exports.createTelemetry = async (req, res) => {
  try {
    const { truck, temperature, door_open } = req.body;

    const existingTruck = await Truck.findById(truck);

    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    const newTelemetry = await Telemetry.create(req.body);

    //  Mise à jour lastSeen
    existingTruck.lastSeen = Date.now();

    //  Vérification des alertes télémétriques
    await existingTruck.processTelemetryAlerts(temperature, door_open);

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
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // Verify truck belongs to user's company
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
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};