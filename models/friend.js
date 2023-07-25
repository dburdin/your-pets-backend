const { Schema, model } = require("mongoose");

const friendsSchema = new Schema({
  title: { type: String },
  url: { type: String },
  addressUrl: { type: String },
  imageUrl: { type: String },
  address: { type: String },
  workDays: [],
  phone: { type: String },
  email: { type: String },
});

const Friends = model("friend", friendsSchema);

module.exports = Friends;
