const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      ...req.body,
      role: req.body.role === "admin" ? "user" : req.body.role,
    });

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

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required !!!",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.checkPass(password, user.password))) {
      return res.status(400).json({
        message: "Email or Password are incorrect !!!",
      });
    }

    const token = createToken(user._id, user.email);

    return res.status(200).json({
      message: "Logged in successfully !!!",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};