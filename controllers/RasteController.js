const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Raste = require("../models/Raste");
const Center = require("../models/Center");

exports.addRaste = (req, res) => {
  // console.log('req.body az addRaste RasteController', req.body);

  const { name, enName, etehadiye } = req.body;

  const raste = new Raste({
    name,
    enName,

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

  const { _id, name, enName } = req.body;

  Raste.findOneAndUpdate({ _id: _id }, { name: name, enName: enName })
    .exec()
    .then(RasteUpdated => {
      // console.log('RasteUpdated.enName ', RasteUpdated)

      let Raste = { _id: RasteUpdated._id, name: name, enName: enName, pic: RasteUpdated.pic };

      Center.find({ RastesRef: Raste._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateRaste', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.RastesEnName = Center.RastesEnName.filter(en => en !== RasteUpdated.enName);
                Center.Rastes = Center.Rastes.filter(ct => ct.enName !== RasteUpdated.enName);

                Center.RastesEnName.push(Raste.enName);
                Center.Rastes.push(Raste);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ Raste: Raste, CenterLength: resp.length }));
          } else {
            return res.json({ Raste: Raste, CenterLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved" }));
};

exports.removeRaste = (req, res) => {
  // console.log('req.body az removeRaste :', req.body);
  Raste.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedRaste => res.json({ raste: removedRaste }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};
