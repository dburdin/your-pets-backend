const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const { HttpError } = require("../helpers");

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
    transformation: [{ width: 250, height: 250, crop: "fill" }, { quality: 80 }],
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

const uploadCloudPet = multer({
  storage: storageForPets,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(HttpError(400, "File should be an image"));
    }
    cb(null, true);
  },
});

module.exports = {
  uploadCloudPet,
  localStorageForPets,
};
