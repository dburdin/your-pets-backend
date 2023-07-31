const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

//  "example@example.com"
// eslint-disable-next-line no-useless-escape
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// password = "Abc123"
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;
// DD-MM-YYYY
const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    birthDate: {
      type: String,
      match: dateRegex,
      default: "00-00-0000",
      required: true,
    },

    avatarURL: {
      type: String,
      required: true,
    },
    avatar_public_id: {
      type: String,
    },
    city: { type: String },
    phone: { type: String },
    myPets: [{ type: Schema.Types.ObjectId, ref: "pet" }],
    favoritePets: [{ type: Schema.Types.ObjectId, ref: "pet" }],
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(16).required(),
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "email should looks like: example@example.com",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "password shoud be: max 16, min 6; contain: one UpperCase letter, one LowerCase letter, one number",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.pattern.base": "email should looks like: example@example.com",
  }),
  password: Joi.string().min(6).max(16).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(16),
  email: Joi.string().pattern(emailRegex).messages({
    "string.pattern.base": "email should looks like: example@example.com",
  }),
  birthDate: Joi.string().pattern(dateRegex).messages({
    "string.pattern.base": "Birth date format: DD-MM-YYYY",
  }),
  phone: Joi.string(),
  city: Joi.string(),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
