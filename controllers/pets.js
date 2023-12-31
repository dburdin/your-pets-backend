const { actionTypeEnum, avatarFolders } = require("../constants/enums");
const { ctrlWrapper, HttpError } = require("../helpers");
const { Pet, User } = require("../models");

const ImageService = require("../services/imageService");

const addPet = async (req, res) => {
  const { _id: owner } = req.user;
  const { file } = req;

  if (file) {
    if (file.size > 3 * 1024 * 1024) {
      throw HttpError(400, "file size should be less then 3 mb");
    }
    const data = await ImageService.save(req, avatarFolders.petAvatar);
    req.body.petAvatar = data.url;
    req.body.avatar_public_id = data.public_id;
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
  const { id: petId } = req.params;
  const { _id: userId } = req.user;

  const pet = await Pet.findOneAndDelete({ _id: petId, owner: userId });
  if (!pet) {
    throw HttpError(
      404,
      `Pet with ${petId} was not found, or you not authorized to delete it`
    );
  }

  ImageService.delete(pet.avatar_public_id);

  if (pet.action === actionTypeEnum.MYPET) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { myPets: petId },
    });
  }

  res.json({
    message: "Pet was deleted successfully",
  });
};

module.exports = {
  addPet: ctrlWrapper(addPet),
  deletePet: ctrlWrapper(deletePet),
};
