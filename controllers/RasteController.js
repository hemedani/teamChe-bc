const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Raste = require("../models/Raste");
const Center = require("../models/Center");

exports.addRaste = (req, res) => {
  // console.log('req.body az addRaste RasteController', req.body);

  const { name, enName, etehadiye, otaghAsnaf, isic } = req.body;

  const raste = new Raste({
    name,
    enName,
    isic,

    etehadiye,
    otaghAsnaf,

    creator: req.user._id
  });

  raste
    .save()
    .then(RasteSaved => res.json({ raste: RasteSaved }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.Rastes = (req, res) => {
  let query = {};

  req.query._id
    ? (query._id = { $lt: mongoose.Types.ObjectId(req.query._id) })
    : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (req.query.name) query = { ...query, name: { $regex: req.query.name } };
  if (req.query.etehadiye) query = { ...query, etehadiye };

  if (req.user.asOrganization) query.otaghAsnaf = req.user.asOrganization;
  if (req.user.etOrganization) query.etehadiye = req.user.etOrganization;

  Raste.find(query)
    .limit(30)
    .sort({ _id: -1 })
    .exec()
    .then(rastes => res.json({ rastes }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.updateRaste = (req, res) => {
  // console.log('req.body az yourRaste', req.body)

  const { _id, name, enName, isic, etehadiye, otaghAsnaf } = req.body;

  Raste.findOneAndUpdate({ _id }, { name, enName, isic, etehadiye, otaghAsnaf }, { new: true })
    .exec()
    .then(RasteUpdated => res.json({ raste: RasteUpdated }))
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};

exports.removeRaste = (req, res) => {
  // console.log('req.body az removeRaste :', req.body);
  Raste.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedRaste => res.json({ raste: removedRaste }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};
