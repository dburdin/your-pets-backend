const { HttpError } = require("../helpers");
const userNameHandler = require("../helpers/userNameHandler");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }

    const name = req.body.name ? userNameHandler(req.body.name) : undefined;

    req.body = { ...req.body, name };
    next();
  };
  return func;
};

module.exports = validateBody;
