const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require("../controllers/companyController");

const { protectorMW, restrictTo } = require("../middlewares/authGuard");

const router = require("express").Router();

router
  .route("/api/companies")
  .post(protectorMW, restrictTo("admin"), createCompany)
  .get(protectorMW, getCompanies);

router
  .route("/api/companies/:id")
  .get(protectorMW, getCompanyById);

module.exports = router;