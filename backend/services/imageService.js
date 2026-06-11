import sharp from "sharp";

export const processImage = async (data) => {
  try {
    const outputPath = `processed/resized-${Date.now()}.jpg`;

    await sharp(data.imagePath)
      .resize(300, 300)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    throw new Error(error.message);
  }
};