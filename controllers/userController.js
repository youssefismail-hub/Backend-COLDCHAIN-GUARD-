const User = require("../models/userModel");
const { pickUserFields } = require("../utils/sanitizeUserInput");

exports.createUser = async (req, res) => {
  try {
    const userData = pickUserFields(req.body, { allowRole: true, isAdmin: true });
    const newUser = await User.create(userData);

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
    console.error("createUser error:", error.message);
    return res.status(400).json({
      message: "Unable to create user.",
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
    console.error("getUsers error:", error.message);
    return res.status(400).json({
      message: "Unable to fetch users.",
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
    console.error("getUserById error:", error.message);
    return res.status(400).json({
      message: "Unable to fetch user.",
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const updates = pickUserFields(req.body, { allowRole: true, isAdmin: true });

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      updates,
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
    console.error("updateUserById error:", error.message);
    return res.status(400).json({
      message: "Unable to update user.",
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
    console.error("deleteUserById error:", error.message);
    return res.status(400).json({
      message: "Unable to delete user.",
    });
  }
};
