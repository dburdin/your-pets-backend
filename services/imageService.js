const multer = require("multer");
const { nanoid } = require("nanoid");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const { HttpError } = require("../helpers");

require("dotenv").config();

const parser = new DatauriParser();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

class ImageService {
  /**
   * upload image to the memory
   * @param {*} name - of request field
   * @returns
   */
  static upload(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        return cb(HttpError(400, "please upload image"), false);
      }
    };

    return multer({ storage: multerStorage, fileFilter: multerFilter }).single(
      name
    );
  }

  /**
   *upload image to Cloudinary
   * @param {*} req
   * @param {*} folderName - folder on Cloudinary server
   */
  static async save(req, folderName) {
    const { file } = req;
    const fileName = `${req.user._id}_${nanoid()}.jpeg`;

    const imageUri = parser.format(fileName, file.buffer);

    try {
      const imageUrl = await cloudinary.uploader.upload(imageUri.content, {
        folder: folderName,
        transformation: {
          width: 250,
          height: 250,
          crop: "fill",
          quality: 60,
          radius: 40,
        },
      });
      return imageUrl;
    } catch (error) {
      throw HttpError(500, "Cloudinary server error");
    }
  }

  static async delete(public_id) {
    try {
      cloudinary.uploader.destroy(public_id);
    } catch (error) {
      throw HttpError(500, "Cloudinary server error");
    }
  }
}

module.exports = ImageService;
