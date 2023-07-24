const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

const storageForPets = new CloudinaryStorage({
  cloudinary,

  format: ["jpg", "png"],
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  params: {
    folder: () => "petAvatar",
  },
});
const localStorageForPets = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "petAvatar"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCloudPet = multer({ storage: storageForPets });

module.exports = {
  uploadCloudPet,
  localStorageForPets,
};
