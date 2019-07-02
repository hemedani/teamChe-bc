const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Etehadiye = require("../models/Etehadiye");
const Center = require("../models/Center");
const File = require("../models/File");
const fs = require("fs");

exports.addEtehadiye = (req, res) => {
  // console.log("req.body az addEtehadiye EtehadiyeController", req.body);

  let {
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
    pic,
    picRef,
    lat,
    lng
  } = req.body;
  address.text = text;
  const etehadiye = new Etehadiye({
    name,
    enName,
    code,

    otaghAsnaf,
    otaghBazargani,

    city,
    state,
    parish,

    address,
    location: { type: "Point", coordinates: [lng, lat] },

    pic,
    picRef,
    creator: req.user._id
  });

  etehadiye
    .save()
    .then(etehadiyeSaved => res.json({ etehadiye: etehadiyeSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.Etehadiyes = (req, res) => {
  let query = {};

  const { _id, path, city, state } = req.query;
  _id ? (query._id = { $lt: mongoose.Types.ObjectId(_id) }) : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (path) query.fullPath = { $regex: path };
  if (city) query.city = city;
  if (state) query.state = state;

  if (req.user.asOrganization) query.otaghAsnaf = req.user.asOrganization;

  Etehadiye.find(query)
    .limit(15)
    .sort({ _id: -1 })
    .exec()
    .then(etehadiyes => res.json({ etehadiyes }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.updateEtehadiye = (req, res) => {
  // console.log("req.body az updateEtehadiye", req.body);

  const { _id, name, enName, credit } = req.body;

  let updateObj = {};
  if (name) updateObj.name = name;
  if (enName) updateObj.enName = enName;

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

exports.addOfficerToEtehadiye = (req, res) => {
  const { _id, users } = req.body;
  const usersId = users.map(user => user._id);

  Etehadiye.findById(_id)
    .exec()
    .then(async findedEt => {
      const availableUser = await User.find({ _id: { $in: usersId } });

      const sortedAvailableUserByEt = availableUser.reduce((pValue, cValue) => {
        if (cValue.etOrganization) {
          pValue[cValue.etOrganization] = pValue[cValue.etOrganization] || [];
          pValue[cValue.etOrganization].push(cValue._id);
        }
        return pValue;
      }, {});

      let promises = [];

      for (let key in sortedAvailableUserByEt) {
        const promise = Etehadiye.findOneAndUpdate(
          { _id: key },
          { $pullAll: { officers: sortedAvailableUserByEt[key] } },
          { new: true }
        );
        promises.push(promise);
      }

      const clearEts = await Promise.all(promises);

      await Promise.all(
        findedEt.officers.map(ofId => User.findOneAndUpdate({ _id: ofId }, { etOrganization: null }, { new: true }))
      );

      await Promise.all(usersId.map(ofId => User.findOneAndUpdate({ _id: ofId }, { etOrganization: null }, { new: true })));

      const updatedEt = await Etehadiye.findOneAndUpdate({ _id }, { officers: usersId }, { new: true });

      const updatedUsers = await Promise.all(
        usersId.map(userId => User.findOneAndUpdate({ _id: userId }, { etOrganization: _id }, { new: true }))
      );

      return res.json({ etehadiye: updatedEt, users: updatedUsers, updatedEts: clearEts });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeEtehadiye = (req, res) => {
  // console.log('req.body az removeEtehadiye :', req.body);
  Etehadiye.findOneAndDelete({ _id: req.body._id })
    .exec()
    .then(removedEtehadiye => res.json({ etehadiye: removedEtehadiye }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
