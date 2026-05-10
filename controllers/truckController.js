const Truck = require("../models/truckModel");

exports.createTruck = async (req, res) => {
  try {
    const newTruck = await Truck.create(req.body);

    return res.status(201).json({
      message: "Truck Created Successfully !!!",
      data: newTruck,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("company", "name");

    return res.status(200).json({
      message: "Trucks Fetched Successfully !!!",
      results: trucks.length,
      data: trucks,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate(
      "company",
      "name"
    );

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
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);

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
      message: "Fail !",
      error: error.message,
    });
  }
};