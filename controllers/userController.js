const User = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    return res.status(201).json({
      message: "User Created !!!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company }).select("-password -__v");

    return res.status(200).json({
      message: "Users Fetched !!!",
      results: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, company: req.user.company }).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "User Fetched !!!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "User Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "User Updated !!!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, company: req.user.company });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "User Deleted Successfully !!!",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};