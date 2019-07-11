const _ = require("lodash");
const Etehadiye = require("../../models/Etehadiye");
const Center = require("../../models/Center");
const File = require("../../models/File");
const fs = require("fs");

exports.updateEtehadiye = (req, res) => {
  // console.log("req.body az updateEtehadiye", req.body);

  const {
    _id,
    name,
    enName,
    code,
    otaghAsnaf,
    otaghBazargani,
    city,
    state,
    parish,
    address,
    text,
    lat,
    lng,
    credit
  } = req.body;
  address.text = text;

  let updateObj = {};
  if (name) updateObj.name = name;
  if (enName) updateObj.enName = enName;
  if (code) updateObj.code = code;

  if (otaghAsnaf) updateObj.otaghAsnaf = otaghAsnaf;
  if (otaghBazargani) updateObj.otaghBazargani = otaghBazargani;
  if (city) updateObj.city = city;
  if (state) updateObj.state = state;
  if (parish) updateObj.parish = parish;
  if (address) updateObj.address = address;
  if (lat && lng) updateObj.location = { type: "Point", coordinates: [lng, lat] };

  if (_.includes(req.user.level, "tarah") || _.includes(req.user.level, "admin")) {
    if (credit) updateObj.credit = credit;
  }

  Etehadiye.findOneAndUpdate({ _id }, updateObj, { new: true })
    .exec()
    .then(EtehadiyeUpdated => res.json({ etehadiye: EtehadiyeUpdated }))
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};

exports.changeEtehadiyePic = (req, res) => {
  const _id = req.body._id,
    pic = req.pic.name,
    picRef = req.pic._id;
  Etehadiye.findById(_id)
    .exec()
    .then(async findedEt => {
      await File.findOneAndDelete({ _id: findedEt.picRef }).exec();
      if (findedEt.pic) {
        fs.unlinkSync(`./pic/orginal/${findedEt.pic}`);
        fs.unlinkSync(`./pic/800/${findedEt.pic}`);
        fs.unlinkSync(`./pic/500/${findedEt.pic}`);
        fs.unlinkSync(`./pic/240/${findedEt.pic}`);
        fs.unlinkSync(`./pic/120/${findedEt.pic}`);
        fs.unlinkSync(`./pic/100/${findedEt.pic}`);
      }
      findedEt.pic = pic;
      findedEt.picRef = picRef;
      const savedEt = await findedEt.save();
      const updatedCenters = await Center.updateMany({ etehadiye: findedEt._id }, { etPic: pic });
      return res.send({ etehadiye: savedEt, nCModified: updatedCenters.nModified });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
