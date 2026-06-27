const Company = require("../models/companyModel");

exports.createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required.",
      });
    }

    const newCompany = await Company.create({ name });

    return res.status(201).json({
      message: "Company Created Successfully !!!",
      data: newCompany,
    });
  } catch (error) {
    console.error("createCompany error:", error.message);
    return res.status(400).json({
      message: "Unable to create company.",
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found !!!",
      });
    }

    return res.status(200).json({
      message: "Companies Fetched Successfully !!!",
      results: 1,
      data: [company],
    });
  } catch (error) {
    console.error("getCompanies error:", error.message);
    return res.status(400).json({
      message: "Unable to fetch companies.",
    });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    if (req.params.id !== req.user.company.toString()) {
      return res.status(403).json({
        message: "You do not have permission to view this company.",
      });
    }

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
    console.error("getCompanyById error:", error.message);
    return res.status(400).json({
      message: "Unable to fetch company.",
    });
  }
};
