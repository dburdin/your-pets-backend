const { actionTypeEnum, avatarFolders } = require("../constants/enums");
const { ctrlWrapper, HttpError } = require("../helpers");
const { Pet } = require("../models/pet");
const { User } = require("../models/user");
const ImageService = require("../services/imageService");

const getAllPets = async (req, res) => {
  const result = await Pet.find().populate("owner", "-password -token");

  res.json(result);
};

const addPet = async (req, res) => {
  const { _id: owner } = req.user;
  const { file } = req;

  if (file) {
    if (file.size > 3 * 1024 * 1024) {
      throw HttpError(400, "file size should be less then 3 mb");
    }
    const { url } = await ImageService.save(req, avatarFolders.petAvatar);
    req.body.petAvatar = url;
  }

  const newPet = await Pet.create({
    ...req.body,
    owner,
  });

  if (req.body.action === actionTypeEnum.MYPET) {
    await User.findByIdAndUpdate(owner, {
      $push: { myPets: newPet._id },
    });
  }
  res.status(201).json(newPet);
};

const deletePet = async (req, res) => {
  const { id } = req.params;

  const result = await Pet.findByIdAndDelete(id);
  if (result.action === actionTypeEnum.MYPET) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { myPets: id },
    });
  }

  if (!result) {
    throw HttpError(404, `Pet with ${id} was not found`);
  }

  res.json({
    message: "Pet was deleted successfully",
  });
};

module.exports = {
  getAllPets: ctrlWrapper(getAllPets),
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
