const mongoose = require("mongoose");
var _ = require("lodash");
const OtaghAsnaf = require("../models/OtaghAsnaf");
const Center = require("../models/Center");
const User = require("../models/user");

exports.addOtaghAsnaf = (req, res, next) => {
  // console.log('req.body az addOtaghAsnaf OtaghAsnafController', req.body);

  let { name, enName, otaghBazargani, city, parish, state, pic, picRef, address, text, lat, lng } = req.body;
  address.text = text;

  const otaghAsnaf = new OtaghAsnaf({
    name,
    enName,

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

  otaghAsnaf
    .save()
    .then(OtaghAsnafSaved => res.json({ OtaghAsnaf: OtaghAsnafSaved }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.OtaghAsnafs = (req, res) => {
  OtaghAsnaf.find()
    // .select("name enName pic")
    .exec()
    .then(OtaghAsnafs => res.json({ OtaghAsnafs }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.updateOtaghAsnaf = (req, res) => {
  // console.log("==================");
  // console.log("req.body", req.body);
  // console.log("==================");

  const { _id, name, enName, otaghBazargani, city, parish, state, address, text, lat, lng } = req.body;
  address.text = text;

  OtaghAsnaf.findOneAndUpdate(
    { _id },
    {
      name,
      name,
      enName,

      otaghBazargani,

      city,
      state,
      parish,

      address,
      location: { type: "Point", coordinates: [lng, lat] }
    },
    { new: true }
  )
    .exec()
    .then(OtaghAsnafUpdated => res.json({ otaghAsnaf: OtaghAsnafUpdated }))
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};

exports.getOtaghAsnaf = (req, res) => {
  const { _id } = req.query;

  OtaghAsnaf.findById(_id)
    .exec()
    .then(otaghAsnaf => res.json({ otaghAsnaf }));
};

exports.addOperatorAs = (req, res) => {
  const { _id, users } = req.body;
  const usersId = users.map(user => user._id);

  OtaghAsnaf.findById(_id)
    .exec()
    .then(async foundedAs => {
      const availableUser = await User.find({ _id: { $in: usersId } });

      const sortedAvailableUserByAs = availableUser.reduce((pValue, cValue) => {
        if (cValue.asOrganization) {
          pValue[cValue.asOrganization] = pValue[cValue.asOrganization] || [];
          pValue[cValue.asOrganization].push(cValue._id);
        }
        return pValue;
      }, {});

      let promises = [];

      for (let key in sortedAvailableUserByAs) {
        const promise = OtaghAsnaf.findOneAndUpdate(
          { _id: key },
          { $pullAll: { operators: sortedAvailableUserByAs[key] } },
          { new: true }
        );
        promises.push(promise);
      }

      const clearAses = await Promise.all(promises);

      await Promise.all(
        foundedAs.operators.map(ofId => User.findOneAndUpdate({ _id: ofId }, { asOrganization: null }, { new: true }))
      );

      await Promise.all(usersId.map(ofId => User.findOneAndUpdate({ _id: ofId }, { asOrganization: null }, { new: true })));

      const updatedAs = await OtaghAsnaf.findOneAndUpdate({ _id }, { operators: usersId }, { new: true });

      const updatedUsers = await Promise.all(
        usersId.map(userId => User.findOneAndUpdate({ _id: userId }, { asOrganization: _id }, { new: true }))
      );

      // console.log("==================");
      // console.log("updatedAs addOperatoeAs", updatedAs);
      // console.log("==================");

      // console.log("==================");
      // console.log("updatedUsers addOperatoeAs", updatedUsers);
      // console.log("==================");

      // console.log("==================");
      // console.log("clearAses addOperatoeAs", clearAses);
      // console.log("==================");

      return res.json({ otaghAsnaf: updatedAs, users: updatedUsers, updatedAses: clearAses });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
exports.removeOtaghAsnaf = (req, res) => {
  console.log("==================");
  console.log("req.body", req.body);
  console.log("==================");
  const { _id } = req.body;

  OtaghAsnaf.findOneAndDelete({ _id })
    .exec()
    .then(removedOtaghAsnaf => res.json({ otaghAsnaf: removedOtaghAsnaf }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};
