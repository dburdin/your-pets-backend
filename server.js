const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const { DB_HOST, PORT } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 8000");
    });
  })
  .catch((error) => {
    console.log("error.message", error.message);

    process.exit(1);
  });
