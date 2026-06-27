const Alert = require("../models/alertModel");
const Truck = require("../models/truckModel");

exports.getAlerts = async (req, res) => {
  try {
    const companyTrucks = await Truck.find({ company: req.user.company });
    const companyTrucksIds = companyTrucks.map(truck => truck._id);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 50;
    const skip = (page - 1) * limit;

    const alerts = await Alert.find({ truck: { $in: companyTrucksIds } })
      .populate("truck", "name plate_number")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Alerts Fetched Successfully !!!",
      results: alerts.length,
      page,
      limit,
      data: alerts,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to fetch alerts.",
    });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate("truck");

    if (!alert || alert.truck.company.toString() !== req.user.company.toString()) {
      return res.status(404).json({
        message: "Alert Not Found or access denied !!!",
      });
    }

    alert.resolved = true;
    await alert.save();

    return res.status(200).json({
      message: "Alert Resolved Successfully !!!",
      data: alert,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to resolve alert.",
    });
  }
};