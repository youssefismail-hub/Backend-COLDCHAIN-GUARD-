const User = require("../models/userModel");
const Company = require("../models/companyModel");
const jwt = require("jsonwebtoken");
const { pickUserFields } = require("../utils/sanitizeUserInput");

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signUp = async (req, res) => {
  try {
    const userData = pickUserFields(req.body, { allowRole: true, isAdmin: false });

    if (!userData.company) {
      return res.status(400).json({
        message: "A valid company is required.",
      });
    }

    const company = await Company.findById(userData.company);
    if (!company) {
      return res.status(400).json({
        message: "Company not found.",
      });
    }

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
    console.error("signUp error:", error.message);
    return res.status(400).json({
      message: "Unable to create user. Check your input and try again.",
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
    console.error("signIn error:", error.message);
    return res.status(400).json({
      message: "Unable to sign in. Please try again.",
    });
  }
};
