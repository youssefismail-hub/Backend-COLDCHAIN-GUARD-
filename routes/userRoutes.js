const { signUp, signIn } = require("../controllers/authController");
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");

const { protectorMW } = require("../middlewares/authGuard");

const router = require("express").Router();

// Auth routes
router.post("/api/signUp", signUp);
router.post("/api/signIn", signIn);

// Protected routes
router
  .route("/api/users")
  .post(protectorMW, createUser)
  .get(protectorMW, getUsers);

router
  .route("/api/users/:id")
  .get(protectorMW, getUserById)
  .patch(protectorMW, updateUserById)
  .delete(protectorMW, deleteUserById);

module.exports = router;