const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const crypto = require("crypto");
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const Email = require("../services/emailService");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  // const verifyEmail = {
  //   to: email,
  //   subject: "Verify email",
  //   html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
  // };

  // await sendEmail(verifyEmail);
  try {
    const verifyUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify/${verificationCode}`;

    await new Email(newUser, verifyUrl).sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email not found");

  // one time password
  const otp = user.creatPasswordResetToken();

  await user.save();

  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/set-new-password/${otp}`;

    await new Email(user, resetUrl).sendRestorePassword();
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  res
    .status(200)
    .json({ message: "Password reset instructions sent to email." });
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.otp)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw HttpError(400, "Token is invalid");

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  res.status(200).json({ user });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) throw HttpError(401, "Email not found");

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({ message: "email verification succeed" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email not found");
  if (user.verify) throw HttpError(401, "Email already verified");
  // eslint-disable-next-line no-shadow
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification request sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password invalid");

  if (!user.verify) throw HttpError(401, "Email is not verified");

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
};

const getCurrent = (req, res) => {
  const { email, name } = req.user;

  res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  // we make URL consider that all requests for files redirecting to folder public
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  forgotPassword: ctrlWrapper(forgotPassword),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  resetPassword: ctrlWrapper(resetPassword),
};
