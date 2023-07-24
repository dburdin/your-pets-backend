const { ctrlWrapper, HttpError } = require("../helpers");
const { Pet } = require("../models/pet");

const getAllPets = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Pet.find({ owner }, "-createdAt -updatedAt", {}).populate(
    "owner",
    "name date type comments petAvatar"
  );

  res.json(result);
};

const addPet = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Pet.create({
    ...req.body,
    owner,
    petAvatar: req.file.path,
  });

  res.status(201).json(result);
};

const deletePet = async (req, res) => {
  const { id } = req.params;

  const result = await Pet.findByIdAndDelete(id);

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
