const {
  createTruck,
  getTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
} = require("../controllers/truckController");

const { protectorMW } = require("../middlewares/authGuard");

const router = require("express").Router();

router
  .route("/api/trucks")
  .post(protectorMW, createTruck)
  .get(protectorMW, getTrucks);

router
  .route("/api/trucks/:id")
  .get(protectorMW, getTruckById)
  .patch(protectorMW, updateTruck)
  .delete(protectorMW, deleteTruck);

module.exports = router;