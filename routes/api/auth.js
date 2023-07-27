const express = require("express");
const {
  validateBody,
  authenticate,
  uploadImage,
} = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { avatarFolders } = require("../../constants/enums");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/updateUser",
  authenticate,
  uploadImage(avatarFolders.userAvatar),
  validateBody(schemas.updateSchema),
  ctrl.updateUser
);

module.exports = router;
