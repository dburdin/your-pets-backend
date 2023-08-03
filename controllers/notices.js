const { ctrlWrapper, HttpError } = require("../helpers");
const { Pet, User } = require("../models");
const { populate } = require("../models/friend");

const getNotices = async (req, res) => {
  const { action, searchQuery = "", page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const category = action ? { action: action } : null;

  const data = await Pet.find({
    $and: [
      {
        ...Object.entries(req.query).reduce((acc, [key, value]) => {
          if (key === "price") return acc;
          acc[key] = { $regex: new RegExp(value, "i") };
          return acc;
        }, {}),
        ...category,
        title: { $regex: new RegExp(searchQuery, "i") },
      },
      { action: { $ne: "my pet" } },
    ],
  })
    .skip(skip)
    .limit(limit)
    .populate("owner", "-myPets -favoritePets -password -token");

  res.json(data);
};

const getMyNotices = async (req, res) => {
  const { _id } = req.user;
  const result = await Pet.find({
    $and: [{ owner: _id }, { action: { $ne: "my pet" } }],
  }).populate('owner');

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const pet = await Pet.findById(id).populate("owner", "-token -password");
  if (!pet) {
    throw HttpError(404, "not found");
  }

  res.json(pet);
};

const getFavorites = async (req, res) => {
  const { _id } = req.user;
  const { favoritePets } = await User.findById(_id).populate("favoritePets");
  res.json(favoritePets);
};

const addFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner, favoritePets } = req.user;

  if (favoritePets.includes(id)) {
    throw HttpError(409, "Notice is already in favorites");
  }

  await User.findByIdAndUpdate(owner, {
    $push: { favoritePets: id },
  });

  res.json({ message: `Notice was added to favorites of ${req.user.name}` });
};

const deleteFavorite = async (req, res) => {
  const { id } = req.params;
  const { favoritePets } = req.user;

  if (!favoritePets.includes(id)) {
    throw HttpError(409, `Notice with ${id} was not found`);
  }

  const result = await User.findByIdAndUpdate(req.user._id, {
    $pull: { favoritePets: id },
  });

  if (!result) {
    throw HttpError(404, `Notice with ${id} was not found`);
  }

  res.json({ message: "Notice was removed from favorites" });
};

module.exports = {
  getNotices: ctrlWrapper(getNotices),
  getMyNotices: ctrlWrapper(getMyNotices),
  getById: ctrlWrapper(getById),
  getFavorites: ctrlWrapper(getFavorites),
  addFavorite: ctrlWrapper(addFavorite),
  deleteFavorite: ctrlWrapper(deleteFavorite),
};
