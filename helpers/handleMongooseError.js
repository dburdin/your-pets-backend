const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  const status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  // eslint-disable-next-line no-param-reassign
  error.status = status;
  next();
};

module.exports = handleMongooseError;

// handleMongooseError
