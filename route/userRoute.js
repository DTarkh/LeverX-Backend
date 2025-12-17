const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.get(
  "/currentuser",
  authController.authMiddleware,
  authController.getCurrentUser
);
router.get("/users", authController.users);
router.patch("/users/:id", authController.patchUsers);

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

module.exports = router;
