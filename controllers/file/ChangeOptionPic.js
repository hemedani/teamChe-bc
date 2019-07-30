const sizeOf = require("image-size");
const Option = require("../../models/Option");
const File = require("../../models/File");
const resizeSharp = require("./utils/Sharp").resizeSharp;

exports.changeOptionPic = async (req, res) => {
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(422).json({
      error: "The uploaded file must be an image"
    });
  }

  var dimensions = sizeOf(req.file.path);

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id });

  await resizeSharp(req.file.filename);

  pic
    .save()
    .then(picSaved => {
      Option.findOneAndUpdate({ _id: req.body.id }, { pic: pic.name, picRef: pic._id }, { new: true })
        .exec()
        .then(OptionUpdated => res.json({ option: OptionUpdated }));
    })
    .catch(err => {
      return res.status(422).json({ error: "did not saved" });
    });
};
