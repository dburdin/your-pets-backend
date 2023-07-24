const express = require("express");

const ctrl = require("../../controllers/pets");

const { validateBody, isValidId, authenticate, uploadCloudPet } = require("../../middlewares");

const { joiPetSchema } = require("../../models/pet");

const router = express.Router();

router.get("/", authenticate, ctrl.getAllPets);

router.post(
  "/",
  authenticate,
  uploadCloudPet.single("petAvatar"),
  validateBody(joiPetSchema),
  ctrl.addPet
);

router.delete("/:id", authenticate, isValidId, ctrl.deletePet);

module.exports = router;
