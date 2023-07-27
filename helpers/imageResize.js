const Jimp = require('jimp');

const imageResize = async path => {
  const img = await Jimp.read(path);

  await img.resize(250, 250);
  await img.writeAsync(path);

  return img;
};

module.exports = imageResize;
