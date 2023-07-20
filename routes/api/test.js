const express = require("express");

const testRouter = express.Router();

testRouter.get("/", async (req, res) => {
  await res.json({ message: "Test is OK" });
});

module.exports = testRouter;
