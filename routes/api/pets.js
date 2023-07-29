const express = require("express");

const ctrl = require("../../controllers/pets");

const {
  validateBody,
  isValidId,
  authenticate,
  uploadImage,
} = require("../../middlewares");

const { joiPetSchema } = require("../../models/pet");
const { avatarFolders } = require("../../constants/enums");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  uploadImage(avatarFolders.petAvatar),
  validateBody(joiPetSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
