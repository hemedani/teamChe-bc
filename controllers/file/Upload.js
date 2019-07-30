const sizeOf = require("image-size");
const File = require("../../models/File");
const resizeSharp = require("./utils/Sharp").resizeSharp;

exports.upload = async (req, res) => {
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
    .then(picSaved => res.status(200).send(picSaved))
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};
