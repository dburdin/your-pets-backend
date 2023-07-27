const { Notices } = require('../models/notices');

exports.addOwnNotice = async (userId, body) => {
  try {
    const notice = new Notices({
      ...body,
      price: Number(body.price),
      owner: userId,
    });

    await notice.save();

    return notice;
  } catch (error) {
    console.log(error);
  }
};

exports.addNoticeToFavorite = async (userId, noticeId) => {
  try {
    const notice = await Notices.findOneAndUpdate(
      { _id: noticeId },
      { $push: { favorite: userId } }
    );

    return notice;
  } catch (error) {
    console.log(error);
  }
};

exports.removeNoticeFromFavorite = async (userId, noticeId) => {
  try {
    return await Notices.findOneAndUpdate(
      { _id: noticeId },
      { $pull: { favorite: userId } },
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.removeOwnNotice = async (userId, noticeId) => {
  try {
    return await Notices.findOneAndDelete({ _id: noticeId, owner: userId });
  } catch (error) {
    console.log(error);
  }
};

exports.listNoticesByCategory = async (category, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find({ category }, '-createdAt -updatedAt -idCloudAvatar')
      .sort({ createdAt: -1 })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};

exports.getNoticeById = async noticeId => {
  try {
    const notice = await Notices.findById(
      { _id: noticeId },
      '-createdAt -updatedAt -idCloudAvatar'
    ).populate('owner', 'email phone');

    return notice;
  } catch (error) {
    console.log(error);
  }
};

exports.listUserOwnNotices = async (userId, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find({ owner: userId }, '-createdAt -updatedAt -idCloudAvatar')
      .sort({ createdAt: -1 })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};

exports.listFavoriteNotices = async (userId, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find(
      {
        favorite: { $in: userId },
      },
      '-createdAt -updatedAt -idCloudAvatar'
    )
      .sort({
        createdAt: -1,
      })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};

exports.searcNoticeByTitle = async ({ search, category }, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find(
      { category, title: { $regex: new RegExp(search, 'i') } },
      '-createdAt -updatedAt'
    )
      .sort({ createdAt: -1 })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};

exports.searchFavoriteNoticeByTitle = async ({ search, userId }, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find(
      { favorite: { $in: userId }, title: { $regex: new RegExp(search, 'i') } },
      '-createdAt -updatedAt -idCloudAvatar'
    )
      .sort({ createdAt: -1 })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};

exports.searchUserNoticeByTitle = async ({ search, userId }, { skip = 0, limit = 12 }) => {
  try {
    const notices = await Notices.find(
      { owner: userId, title: { $regex: new RegExp(search, 'i') } },
      '-createdAt -updatedAt -idCloudAvatar'
    )
      .sort({ createdAt: -1 })
      .populate('owner', 'email phone')
      .skip(skip)
      .limit(limit);

    return notices;
  } catch (error) {
    console.log(error);
  }
};
