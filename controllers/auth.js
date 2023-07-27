const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { avatarFolder } = require("../constants/enums");

const { ctrlWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");
const ImageService = require("../services/imageService");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const avatarURL = `${req.protocol}://${req.get(
    "host"
  )}/avatars/defaultAvatar.png`;
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  newUser = await User.findByIdAndUpdate(newUser._id, { token }, { new: true });

  res.status(201).json(newUser);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password invalid");

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      token,
    },
    { new: true }
  ).populate(["myPets", "favoritePets"]);

  res.json(updatedUser);
};

const getCurrent = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).populate(["myPets", "favoritePets"]);
  res.json(user);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { file } = req;

  if (file) {
    if (file.size > 3 * 1024 * 1024) {
      throw HttpError(400, "file size should be less then 3 mb");
    }
    const { url } = await ImageService.save(req, avatarFolder.userAvatar);
    req.body.avatarURL = url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { ...req.body },
    { new: true }
  );
  updatedUser.password = "";
  res.status(201).json(updatedUser);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUser: ctrlWrapper(updateUser),
};
