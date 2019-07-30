const sharp = require("sharp");

// exports.resizeSharp = filename => {
//   sharp(`./pic/orginal/${filename}`)
//     .resize(800, 600)
//     .toFile(`./pic/800/${filename}`);

//   sharp(`./pic/orginal/${filename}`)
//     .resize(500, 375)
//     .toFile(`./pic/500/${filename}`);

//   sharp(`./pic/orginal/${filename}`)
//     .resize(240, 180)
//     .toFile(`./pic/240/${filename}`);

//   sharp(`./pic/orginal/${filename}`)
//     .resize(120, 120)
//     .toFile(`./pic/120/${filename}`);

//   sharp(`./pic/orginal/${filename}`)
//     .resize(100, 75)
//     .toFile(`./pic/100/${filename}`);
// };

const sharpingJpg = async (width, filename) =>
  await sharp(`./pic/orginal/${filename}`)
    .jpeg({
      quality: 85,
      chromaSubsampling: "4:4:4"
    })
    .resize({ width })
    .toFile(`./pic/${width}/${filename}`);

const sharpingOther = async (width, filename) =>
  await sharp(`./pic/orginal/${filename}`)
    .resize({ width })
    .toFile(`./pic/${width}/${filename}`);

exports.resizeSharp = async filename => {
  if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
    await sharpingJpg(800, filename);
    await sharpingJpg(500, filename);
    await sharpingJpg(240, filename);
    await sharpingJpg(120, filename);
    await sharpingJpg(100, filename);
  } else {
    await sharpingOther(800, filename);
    await sharpingOther(500, filename);
    await sharpingOther(240, filename);
    await sharpingOther(120, filename);
    await sharpingOther(100, filename);
  }
};
