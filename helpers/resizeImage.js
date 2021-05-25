const sharp = require("sharp");

export default resizeImage = async (img) =>
  await sharp(img).resize(512).webp().toBuffer();
