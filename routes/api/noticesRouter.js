const express = require('express');

const noticesRouter = express.Router();

const noticesMiddlewares = require('../../middlewares/noticesMiddlewares');
const noticesController = require('../../controllers/noticesController');
const ImageService = require('../../services/imageService');
const { isValidId, authenticate } = require('../../middlewares');

noticesRouter.route('/:category').get(noticesController.listNoticesByCategory);

noticesRouter.route('/card/:id').get(isValidId, noticesController.getNoticeById);

noticesRouter.route('/title/search/:category').get(noticesController.searcNoticeByTitle);

noticesRouter.use(authenticate);

noticesRouter
  .route('/')
  .post(
    [ImageService.upload('photo'), noticesMiddlewares.checkAddNotice],
    noticesController.addOwnNotice
  );

noticesRouter
  .route('/:id/favorite')
  .post(
    [isValidId, noticesMiddlewares.checkAddNoticeToFavorite],
    noticesController.addNoticeToFavorite
  );

noticesRouter
  .route('/:id/favorite')
  .delete(
    [isValidId, noticesMiddlewares.checkDelNoticeFromFavorite],
    noticesController.removeNoticeFromFavorite
  );

noticesRouter
  .route('/:id')
  .delete([isValidId, noticesMiddlewares.checkRemoveOwnNotice], noticesController.removeOwnNotice);

noticesRouter.route('/user/own').get(noticesController.listUserOwnNotices);
noticesRouter.route('/user/favorite').get(noticesController.listFavoriteNotices);
noticesRouter.route('/title/favorite').get(noticesController.searchFavoriteNoticeByTitle);
noticesRouter.route('/title/own').get(noticesController.searchUserNoticeByTitle);

module.exports = noticesRouter;
