const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require("../controllers/companyController");

const { protectorMW } = require("../middlewares/authGuard");

const router = require("express").Router();

router
  .route("/api/companies")
  .post(createCompany)
  .get(protectorMW, getCompanies);

router
  .route("/api/companies/:id")
  .get(protectorMW, getCompanyById);

module.exports = router;