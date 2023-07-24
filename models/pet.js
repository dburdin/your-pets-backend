const { Schema, Types, model } = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../helpers");

const generalRegExp = /^[a-zA-Z]+$/;
const dateRegExp = /^\d{2}-\d{2}-\d{4}$/;

const petSchema = new Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 16,
    match: [generalRegExp, "Only English letters can be accepted"],
    required: [true, "Pet's name is required"],
  },
  birthday: {
    type: String,
    match: [dateRegExp, "Only DD-MM-YYYY format can be accepted"],
    required: [true, "Pet's birthday is required"],
  },
  type: {
    type: String,
    minLength: 2,
    maxLength: 16,
    match: [generalRegExp, "Only English letters can be accepted"],
    required: [true, "Pet's type is required"],
  },
  comments: {
    type: String,
    minLength: 1,
    maxLength: 120,
    default: null,
  },
  petsAvatar: {
    type: String,
  },
  owner: {
    type: Types.ObjectId,
    ref: "user",
    required: [true, "Pet must have an owner"],
  },
});

petSchema.post("save", handleMongooseError);

const joiPetSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)
    .regex(generalRegExp, "Only English letters can be accepted")
    .required(),
  birthday: Joi.string().regex(dateRegExp, "Only DD-MM-YYYY format can be accepted").required(),
  type: Joi.string()
    .min(2)
    .max(16)
    .regex(generalRegExp, "Only English letters can be accepted")
    .required(),
  comments: Joi.string().min(1).max(120),
  petsAvatar: Joi.string(),
});

const Pet = model("Pet", petSchema);

module.exports = { Pet, joiPetSchema };
