const { Schema, Types, model } = require('mongoose');
const petEnum = require('../constants/petEnum');

const petSchema = Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
  },
  sex: {
    type: String,
    enum: Object.values(petEnum),
    required: [true, 'Pet sex is required'],
  },
  birthday: {
    type: String,
    required: [true, 'Pet birthday is required'],
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
  },
  owner: {
    type: Types.ObjectId,
    ref: 'Users',
    required: [true, 'Pet must have an owner'],
  },
});

const Pet = model('Pets', petSchema);

module.exports = Pet;
