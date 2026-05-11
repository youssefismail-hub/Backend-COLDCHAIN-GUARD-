const Alert = require("../models/alertModel");

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({truck: { $in: companyTrucksIds }})
      .populate("truck", "name plate_number")
      .sort({ created_at: -1 });

    return res.status(200).json({
      message: "Alerts Fetched Successfully !!!",
      results: alerts.length,
      data: alerts,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Alert Resolved Successfully !!!",
      data: alert,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};