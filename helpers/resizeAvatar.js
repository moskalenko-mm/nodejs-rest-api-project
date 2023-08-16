import jimp from "jimp";

const resizeAvatar = async (avatarURL) => {
  // Read the image.
  const image = await jimp.read(avatarURL);

  await image.resize(250, 250);

  await image.writeAsync(avatarURL);
};

export default resizeAvatar;
