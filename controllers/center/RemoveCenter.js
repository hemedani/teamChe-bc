const Center = require("../../models/Center");
const Etehadiye = require("../../models/Etehadiye");

exports.removeAOtherAddFromCenter = (req, res) => {
  Center.findByIdAndUpdate({ _id: req.body.centerId }, { $pull: { otherAdresses: { _id: req.body.addId } } }, { new: true })
    .exec()
    .then(centerUpdated => res.send({ center: centerUpdated }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeCenter = (req, res) => {
  // console.log('req.body az removeCenter :', req.body);

  Center.findById(req.body.id)
    .exec()
    .then(async foundedCenter => {
      const etCenterCount = await Center.countDocuments({ etehadiye: foundedCenter.etehadiye });

      if (Number(etCenterCount) > 20) {
        await Etehadiye.findOneAndUpdate({ _id: foundedCenter.etehadiye }, { $inc: { credit: 10000 } }).exec();
      }

      Center.deleteOne({ _id: req.body.id })
        .exec()
        .then(removedCenter => res.send("ba movafghiyat hazf shod"));
    })

    .catch(err => res.status(422).send({ error: "we have an issues" }));
};

exports.deletePicCenter = (req, res) => {
  // console.log(req.body)
  Center.findById(req.body._id)
    .exec()
    .then(centerFind => {
      // const imgIndex = _.findIndex(centerFind.pic, req.body.pic)
      const imgIndex = centerFind.pic.indexOf(req.body.pic);

      const picRef = centerFind.picRef[imgIndex];
      console.log(imgIndex, picRef);

      Center.findOneAndUpdate({ _id: req.body._id }, { $pull: { pic: req.body.pic, picRef: picRef } }, { new: true })
        .exec()
        .then(centerUpdated => res.json({ center: centerUpdated }));

      // return res.json({ center: centerFind })
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
