const { Schema, Types, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { petEnum, actionTypeEnum } = require("../constants/enums");

const generalRegExp = /^[a-zA-Z]+$/;
const dateRegExp = /^\d{2}-\d{2}-\d{4}$/;

const petSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 16,
      match: [generalRegExp, "Only English letters can be accepted"],
      required: [true, "Pet's name is required"],
    },
    title: {
      type: String,
      // eslint-disable-next-line func-names
      required: function() {
        return this.action !== actionTypeEnum.MYPET;
      },
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
    petAvatar: {
      type: String,
    },
    action: {
      type: String,
      enum: actionTypeEnum,
      required: [
        true,
        "Pick option: 'sell','lost/found', 'in good hands', 'my pet'",
      ],
    },
    sex: {
      type: String,
      enum: petEnum,
      // eslint-disable-next-line func-names
      required: function() {
        return this.action !== actionTypeEnum.MYPET;
      },
    },
    location: {
      type: String,
      // eslint-disable-next-line func-names
      required: function() {
        return this.action !== actionTypeEnum.MYPET;
      },
    },
    price: {
      type: Number,
      // eslint-disable-next-line func-names
      required: function() {
        return this.action === actionTypeEnum.SELL;
      },
    },
    owner: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Pet must have an owner"],
    },
  },
  { timestamps: true, versionKey: false }
);

petSchema.post("save", handleMongooseError);

const joiPetSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)
    .regex(generalRegExp, "Only English letters can be accepted")
    .required(),
  birthday: Joi.string()
    .regex(dateRegExp, "Only DD-MM-YYYY format can be accepted")
    .required(),
  type: Joi.string()
    .min(2)
    .max(16)
    .regex(generalRegExp, "Only English letters can be accepted")
    .required(),
  comments: Joi.string().min(1).max(120),
  location: Joi.string(),
  petAvatar: Joi.string(),
  title: Joi.string(),
  sex: Joi.string().valid(...Object.values(petEnum)),
  action: Joi.string().valid(...Object.values(actionTypeEnum)),
  price: Joi.number().min(0),
});

const Pet = model("pet", petSchema);

module.exports = { Pet, joiPetSchema };
