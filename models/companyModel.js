const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Company name is required !!!"],
    unique: true,
  },

  address: {
    type: String,
    required: [true, "Company address is required !!!"],
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;