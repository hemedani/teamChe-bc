const sizeOf = require("image-size");
const WareType = require("../../models/WareType");
const Ware = require("../../models/Ware");
const File = require("../../models/File");
const resizeSharp = require("./utils/Sharp").resizeSharp;

exports.changeWareTypePic = async (req, res, next) => {
  // console.log('req.user az fileController', req.user)
  console.log("req.body az fileController", req.body);
  // console.log('req.file az fileController', req.file)

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
      WareType.findOneAndUpdate({ _id: req.body.id }, { pic: pic.name, picRef: pic._id }, { new: true })
        .exec()
        .then(wareTypeUpdated => {
          Ware.update({ wareType: wareTypeUpdated._id }, { $set: { wareTypePic: pic.name } }, { multi: true })
            .exec()
            .then(resp => {
              console.log("resp az Ware.update changeWareTypePic", resp);
              res.json({ wareType: wareTypeUpdated });
            });
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};
