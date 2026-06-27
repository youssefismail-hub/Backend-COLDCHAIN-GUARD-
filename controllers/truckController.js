const Truck = require("../models/truckModel");

exports.createTruck = async (req, res) => {
  try {
    const { name, plate_number, min_temperature, max_temperature } = req.body;
    const newTruck = await Truck.create({
      name,
      plate_number,
      min_temperature,
      max_temperature,
      company: req.user.company,
    });

    return res.status(201).json({
      message: "Truck Created Successfully !!!",
      data: newTruck,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to create truck.",
    });
  }
};

exports.getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({company: req.user.company}).populate("company", "name");

    return res.status(200).json({
      message: "Trucks Fetched Successfully !!!",
      results: trucks.length,
      data: trucks,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to fetch trucks.",
    });
  }
};

exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate("company", "name");

    if (!truck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Truck Fetched Successfully !!!",
      data: truck,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to fetch truck.",
    });
  }
};

exports.updateTruck = async (req, res) => {
  try {
    // Prevent callers from overriding the company field
    delete req.body.company;

    const truck = await Truck.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true, runValidators: true }
    );

    if (!truck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Truck Updated Successfully !!!",
      data: truck,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to update truck.",
    });
  }
};

exports.deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!truck) {
      return res.status(404).json({
        message: "Truck Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Truck Deleted Successfully !!!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to delete truck.",
    });
  }
};