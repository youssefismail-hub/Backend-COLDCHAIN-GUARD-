const Company = require("../models/companyModel");

exports.createCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);

    return res.status(201).json({
      message: "Company Created Successfully !!!",
      data: newCompany,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    return res.status(200).json({
      message: "Companies Fetched Successfully !!!",
      results: companies.length,
      data: companies,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Company Fetched Successfully !!!",
      data: company,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Fail !",
      error: error.message,
    });
  }
};