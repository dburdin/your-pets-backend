const ImageService = require('../services/imageService');
/**
 *upload image to the memory
 * @param {*} name - of request field
 * @returns
 */
const uploadAvatar = name => ImageService.upload(name);

module.exports = uploadAvatar;
