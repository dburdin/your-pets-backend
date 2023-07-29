const express = require("express");

const router = express.Router();

const noticesMiddlewares = require("../../middlewares/noticesMiddlewares");
const noticesController = require("../../controllers/notices");
const ImageService = require("../../services/imageService");
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

router.get("/:id", authenticate, isValidId, ctrlNotices.getById);

router.get("/user/ads", authenticate, ctrlNotices.getMyAds);

router.post(
  "/",
  authenticate,
  uploadImage(avatarFolders.petAvatar),
  validateBody(joiPetSchema),
  ctrlPets.addPet
);

router.delete("/:id", authenticate, isValidId, ctrlPets.deletePet);

// router.route("/card/:id").get(isValidId, noticesController.getNoticeById);

// router
//   .route("/title/search/:category")
//   .get(noticesController.searcNoticeByTitle);

// router.use(authenticate);

// router
//   .route("/")
//   .post(
//     [ImageService.upload("photo"), noticesMiddlewares.checkAddNotice],
//     noticesController.addOwnNotice
//   );

// router
//   .route("/:id/favorite")
//   .post(
//     [isValidId, noticesMiddlewares.checkAddNoticeToFavorite],
//     noticesController.addNoticeToFavorite
//   );

// router
//   .route("/:id/favorite")
//   .delete(
//     [isValidId, noticesMiddlewares.checkDelNoticeFromFavorite],
//     noticesController.removeNoticeFromFavorite
//   );

// router
//   .route("/:id")
//   .delete(
//     [isValidId, noticesMiddlewares.checkRemoveOwnNotice],
//     noticesController.removeOwnNotice
//   );

// router.route("/user/own").get(noticesController.listUserOwnNotices);
// router.route("/user/favorite").get(noticesController.listFavoriteNotices);
// router
//   .route("/title/favorite")
//   .get(noticesController.searchFavoriteNoticeByTitle);
// router.route("/title/own").get(noticesController.searchUserNoticeByTitle);

module.exports = router;
