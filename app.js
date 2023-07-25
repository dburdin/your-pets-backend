const express = require("express");
const swaggerUi = require("swagger-ui-express");
const logger = require("morgan");
const cors = require("cors");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();

const authRouter = require("./routes/api/auth");

const petsRouter = require("./routes/api/pets");
// const noticesRouter = require();
// const testRouter = require("./routes/api/test");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRouter);
app.use("/api/pets", petsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

module.exports = app;
