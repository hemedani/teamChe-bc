const sizeOf = require("image-size");
const Raste = require("../../models/Raste");
const File = require("../../models/File");
const resizeSharp = require("./utils/Sharp").resizeSharp;

exports.changeRastePic = (req, res) => {
  console.log("req.body az fileController", req.body);

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(422).json({
      error: "The uploaded file must be an image"
    });
  }

  var dimensions = sizeOf(req.file.path);

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id });

  resizeSharp(req.file.filename);

  pic
    .save()
    .then(picSaved => {
      Raste.findOneAndUpdate({ _id: req.body.id }, { pic: pic.name, picRef: pic._id }, { new: true })
        .exec()
        .then(rasteUpdated => res.json({ raste: rasteUpdated }));
    })
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};
