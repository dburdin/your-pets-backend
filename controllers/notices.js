const { actionTypeEnum, avatarFolders } = require("../constants/enums");
const { ctrlWrapper, HttpError } = require("../helpers");
const { Pet } = require("../models/pet");
const { User } = require("../models/user");
const ImageService = require("../services/imageService");

const getMyAds = async (req, res) => {
  const { _id } = req.user;
  const result = await Pet.find({
    $and: [{ owner: _id }, { action: { $ne: "my pet" } }],
  });

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findById(id);

  res.json(pet);
};

module.exports = {
  getMyAds: ctrlWrapper(getMyAds),
  getById: ctrlWrapper(getById),
};

// exports.addOwnNotice = ctrlWrapper(async (req, res) => {
//   const { _id: userId } = req.user;
//   const { body, file } = req;

//   if (file) {
//     const { path } = req.file;

//     const fileName = path.split('/');
//     console.log(fileName);
//     const length = fileName.length;

//     body.photo = cloudinary.url(fileName[length - 1], {
//       width: 200,
//       height: 200,
//       gravity: 'faces',
//       crop: 'fill',
//       quality: 'auto',
//       fetch_format: 'jpg',
//     });
//   }

//   const notice = await noticesService.addOwnNotice(userId, body);

//   res.status(200).json({ notice });
// });

// exports.addNoticeToFavorite = ctrlWrapper(async (req, res, next) => {
//   const { _id: userId } = req.user;
//   const { id: noticeId } = req.params;

//   const notice = await noticesService.addNoticeToFavorite(userId, noticeId);

//   res.status(200).json({
//     userId: userId,
//     noticeId: notice._id,
//   });
// });

// exports.removeNoticeFromFavorite = ctrlWrapper(async (req, res, next) => {
//   const { _id: userId } = req.user;
//   const { id: noticeId } = req.params;

//   await noticesService.removeNoticeFromFavorite(userId, noticeId);

//   res.status(200).json({ message: 'Notices was deleted from favorites' });
// });

// exports.removeOwnNotice = ctrlWrapper(async (req, res, next) => {
//   const { _id: userId } = req.user;

//   const { id: noticeId } = req.params;

//   await noticesService.removeOwnNotice(userId, noticeId);

//   res.status(200).json({ message: 'Notice was deleted' });
// });

// exports.listNoticesByCategory = ctrlWrapper(async (req, res, next) => {
//   const { category } = req.params;
//   let { page = 1, limit = 12 } = req.query;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;
//   const skip = (page - 1) * limit;

//   const notices = await noticesService.listNoticesByCategory(category, {
//     skip,
//     limit,
//   });

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });

// exports.getNoticeById = ctrlWrapper(async (req, res) => {
//   const { id: noticeId } = req.params;

//   const notice = await noticesService.getNoticeById(noticeId);

//   res.status(200).json({ notice });
// });

// exports.listUserOwnNotices = ctrlWrapper(async (req, res) => {
//   const { _id: userId } = req.user;
//   let { page = 1, limit = 12 } = req.query;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;
//   const skip = (page - 1) * limit;

//   const notices = await noticesService.listUserOwnNotices(userId, {
//     skip,
//     limit,
//   });

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });

// exports.listFavoriteNotices = ctrlWrapper(async (req, res) => {
//   const { _id: userId } = req.user;
//   let { page = 1, limit = 12 } = req.query;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;

//   const skip = (page - 1) * limit;

//   const notices = await noticesService.listFavoriteNotices(userId, {
//     skip,
//     limit,
//   });

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });

// exports.searcNoticeByTitle = ctrlWrapper(async (req, res) => {
//   let { search = '', page = 1, limit = 12 } = req.query;
//   const { category } = req.params;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;

//   const skip = (page - 1) * limit;

//   const notices = await noticesService.searcNoticeByTitle({ search, category }, { skip, limit });

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });

// exports.searchFavoriteNoticeByTitle = ctrlWrapper(async (req, res) => {
//   let { page = 1, limit = 12, search = '' } = req.query;
//   const { _id: userId } = req.user;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;
//   const skip = (page - 1) * limit;

//   const notices = await noticesService.searchFavoriteNoticeByTitle(
//     { search, userId },
//     { skip, limit }
//   );

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });

// exports.searchUserNoticeByTitle = ctrlWrapper(async (req, res) => {
//   const { _id: userId } = req.user;
//   let { page = 1, limit = 12, search = '' } = req.query;

//   page = +page;
//   limit = +limit;

//   limit = limit > 12 ? 12 : limit;
//   const skip = (page - 1) * limit;

//   const notices = await noticesService.searchUserNoticeByTitle({ search, userId }, { skip, limit });

//   res.status(200).json({ notices, page, per_page: limit, total: notices.length });
// });
