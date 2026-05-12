const Telemetry = require("../models/telemetryModel");
const Truck = require("../models/truckModel");
const Alert = require("../models/alertModel");

exports.createTelemetry = async (req, res) => {
  try {
    const { truck, temperature, door_open } = req.body;

    const existingTruck = await Truck.findById({truck: {$in: companyTrucksIds}});

    if (!existingTruck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    const newTelemetry = await Telemetry.create(req.body);

    //  Mise à jour lastSeen
    existingTruck.lastSeen = Date.now();

    //  Vérification température haute
    if (temperature > existingTruck.max_temperature) {
      await Alert.create({
        truck,
        type: "TEMP_HIGH",
        severity: "CRITICAL",
        message: "Temperature exceeds maximum limit !!!",
      });

      existingTruck.status = "CRITICAL";
    }

    //  Vérification température basse
    if (temperature < existingTruck.min_temperature) {
      await Alert.create({
        truck,
        type: "TEMP_LOW",
        severity: "CRITICAL",
        message: "Temperature below minimum limit !!!",
      });

      existingTruck.status = "CRITICAL";
    }

    //  Vérification porte ouverte
    if (door_open === true) {
      await Alert.create({
        truck,
        type: "DOOR_OPEN",
        severity: "WARNING",
        message: "Truck door is open !!!",
      });

      existingTruck.status = "WARNING";
    }

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