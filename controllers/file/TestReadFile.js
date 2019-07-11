const fs = require("fs");
const sharp = require("sharp");

exports.testReadFile = (_, res) => {
  let org = fs.readdirSync("./pic/orginal");
  let p800 = fs.readdirSync("./pic/800");
  let p500 = fs.readdirSync("./pic/500");
  let p240 = fs.readdirSync("./pic/240");
  let p120 = fs.readdirSync("./pic/120");
  let p100 = fs.readdirSync("./pic/100");

  p800.map(rm => fs.unlinkSync(`./pic/800/${rm}`));
  p500.map(rm => fs.unlinkSync(`./pic/500/${rm}`));
  p240.map(rm => fs.unlinkSync(`./pic/240/${rm}`));
  p120.map(rm => fs.unlinkSync(`./pic/120/${rm}`));
  p100.map(rm => fs.unlinkSync(`./pic/100/${rm}`));

  Promise.all(
    org.map(og => {
      sharp(`./pic/orginal/${og}`)
        .resize(800, 600)
        .toFile(`./pic/800/${og}`)
        .then(out => out);

      sharp(`./pic/orginal/${og}`)
        .resize(500, 375)
        .toFile(`./pic/500/${og}`)
        .then(out => out);

      sharp(`./pic/orginal/${og}`)
        .resize(240, 180)
        .toFile(`./pic/240/${og}`)
        .then(out => out);

      sharp(`./pic/orginal/${og}`)
        .resize(120, 120)
        .toFile(`./pic/120/${og}`)
        .then(out => out);

      sharp(`./pic/orginal/${og}`)
        .resize(100, 75)
        .toFile(`./pic/100/${og}`)
        .then(out => out);
    })
  )
    .then(out => res.send({ length: org.length, org }))
    .catch(err => console.log(err));
};
