const express = require("express");
const { signInRequired } = require("../middlewares/authMiddleware");
const {
  loginController,
  registerController,
} = require("../controllers/userController");

// Router Object
const router = express.Router();

// Routes

// REGISTER with POST
router.post("/register", registerController);

// LOGIN with POST
router.post("/login", loginController);

// PROTECTED ROUTE with GET
router.get("/user-auth", signInRequired, (req, res) => {
  res.status(200).send({ ok: true });
});

// Exports
module.exports = router;
