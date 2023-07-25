const express = require("express");
const Friends = require("../../models/friend");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const data = await Friends.find();
  res.json(data);
});

module.exports = router;
