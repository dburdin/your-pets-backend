const isValidId = require("./isValidId");
const validateBody = require("./validateBody");
const authenticate = require("./authenticate");
const uploadImage = require("./uploadImage");
const { uploadCloudPet } = require("./cloudinaryUpload");

module.exports = {
  isValidId,
  validateBody,
  authenticate,
  uploadImage,
  uploadCloudPet,
};
