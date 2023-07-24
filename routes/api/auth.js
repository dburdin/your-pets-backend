const express = require("express");
const avatarFolder = require("../../constants/avatarFolders");

const {
  validateBody,
  authenticate,
  uploadImage,
} = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/updateUser",
  authenticate,
  uploadImage(avatarFolder.userAvatar),
  validateBody(schemas.updateSchema),
  ctrl.updateUser
);

module.exports = router;
