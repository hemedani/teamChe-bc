const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Raste = require("../models/Raste");
const Center = require("../models/Center");

exports.addRaste = (req, res) => {
  // console.log('req.body az addRaste RasteController', req.body);

  const { name, enName, etehadiye, isic } = req.body;

  const raste = new Raste({
    name,
    enName,
    isic,

    etehadiye,

    creator: req.user._id
  });

  raste
    .save()
    .then(RasteSaved => res.json({ Raste: RasteSaved }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.Rastes = (req, res) => {
  Raste.find()
    .exec()
    .then(Rastes => res.json({ Rastes }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.updateRaste = (req, res) => {
  // console.log('req.body az yourRaste', req.body)

  const { _id, name, enName, isic } = req.body;

  Raste.findOneAndUpdate({ _id: _id }, { name: name, enName: enName, isic }, { new: true })
    .exec()
    .then(RasteUpdated => res.json({ Raste: RasteUpdated }))
    .catch(err => res.status(422).json({ error: "did not saved", err }));
};

exports.removeRaste = (req, res) => {
  // console.log('req.body az removeRaste :', req.body);
  Raste.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedRaste => res.json({ raste: removedRaste }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};
