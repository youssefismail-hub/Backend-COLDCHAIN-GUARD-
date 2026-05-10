const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required !!!"],
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "The email is required !!!"],
    validate: [validator.isEmail, "This email is not valid !!!"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required !!!"],
    minlength: 8,
    // validate: [validator.isStrongPassword, "fgghjhkj"],
  },
  confirm_password: {
    type: String,
    required: [true, "The password is required !!!"],
    minlength: 8,
    validate: {
      validator: function (cPass) {
        return cPass === this.password;
      },
      message: "Pass and cPass does not match !!!!",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "test1", "test2"],
    default: "user",
  },
  company: {
  type: mongoose.Schema.ObjectId,
  ref: "Company",
  required: [true, "User must belong to a company !!!"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  last_pass_change_date: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirm_password = undefined;
  }
  return next;
});

userSchema.methods.checkPass = async function (pass, hashedPass) {
  return await bcryptjs.compare(pass, hashedPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
