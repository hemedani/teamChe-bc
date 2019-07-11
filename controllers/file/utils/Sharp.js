const sharp = require("sharp");

exports.resizeSharp = filename => {
  sharp(`./pic/orginal/${filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${filename}`);

  sharp(`./pic/orginal/${filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${filename}`);

  sharp(`./pic/orginal/${filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${filename}`);

  sharp(`./pic/orginal/${filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${filename}`);

  sharp(`./pic/orginal/${filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${filename}`);
};
