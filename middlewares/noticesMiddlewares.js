const { ctrlWrapper } = require('../helpers');
const { notices } = require('../models/notices');
const { HttpError } = require('../helpers/HttpError');
const noticesValidator = require('../helpers/noticesValidator');

exports.checkAddNotice = ctrlWrapper(async (req, res, next) => {
  const { error, value } = noticesValidator.addNoticesValidator(req.body);

  if (error) {
    return next(
      new HttpError(
        400,
        error.details.map(item => `${item.message}`)
      )
    );
  }

  req.body = value;

  next();
});

exports.checkAddNoticeToFavorite = ctrlWrapper(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const { favorite } = await notices.findOne({ _id: id });

  if (favorite.includes(userId)) {
    return next(new HttpError(409, 'Notice already added to favorites'));
  }

  next();
});

exports.checkDelNoticeFromFavorite = ctrlWrapper(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const { favorite } = await notices.findOne({ _id: id });

  if (!favorite.includes(userId)) {
    return next(new HttpError(404, 'Notice not in favorites'));
  }

  next();
});

exports.checkRemoveOwnNotice = ctrlWrapper(async (req, res, next) => {
  const { _id: userId } = req.user;

  const { id } = req.params;

  const delNotice = await notices.findOne({ _id: id, owner: userId });

  if (!delNotice) {
    return next(new HttpError(404, 'Notice not found'));
  }

  next();
});
