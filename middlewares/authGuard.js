const { verify } = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

exports.protectorMW = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in !!!!",
      });
    }

    const decoded = await promisify(verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "This user no longer exists !!!!!",
      });
    }

    if (
      parseInt(user.last_pass_change_date.getTime() / 1000) >
      decoded.iat
    ) {
      return res.status(401).json({
        message: "You must re-login !!!",
      });
    }

    
    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};