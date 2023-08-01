const express = require("express");

const router = express.Router();

const {
  isValidId,
  authenticate,
  uploadImage,
  validateBody,
} = require("../../middlewares");
const { avatarFolders } = require("../../constants/enums");
const { joiPetSchema } = require("../../models/pet");
const ctrlNotices = require("../../controllers/notices");
const ctrlPets = require("../../controllers/pets");

router.get("/", ctrlNotices.getNotices);
router.get("/own", authenticate, ctrlNotices.getMyNotices);

router.get("/favorites", authenticate, ctrlNotices.getFavorites);

router.post("/favorites/:id", authenticate, isValidId, ctrlNotices.addFavorite);

router.delete(
  "/favorites/:id",
  authenticate,
  isValidId,
  ctrlNotices.deleteFavorite
);

router.get("/:id", isValidId, ctrlNotices.getById);

router.post(
  "/",
  authenticate,
  uploadImage(avatarFolders.petAvatar),
  validateBody(joiPetSchema),
  ctrlPets.addPet
);

router.delete("/:id", authenticate, isValidId, ctrlPets.deletePet);

module.exports = router;
