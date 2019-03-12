const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Raste = require("../models/Raste");
const Center = require("../models/Center");

exports.addRaste = (req, res, next) => {
  // console.log('req.body az addRaste RasteController', req.body);

  const { name, enName, etehadiye, otaghAsnaf, otaghBazargani, city, state, pic, picRef } = req.body;

  const Raste = new Raste({
    name,
    enName,

    etehadiye,
    otaghAsnaf,
    otaghBazargani,

    city,
    state,

    pic,
    picRef,
    creator: req.user._id
  });

  Raste.save()
    .then(RasteSaved => res.json({ Raste: RasteSaved }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.Rastes = (req, res) => {
  Raste.find()
    .select("name enName pic")
    .exec()
    .then(Rastes => res.json({ Rastes }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
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
    .then(removedRaste => {
      console.log(removedRaste);

      Center.find({ RastesRef: removedRaste._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateRaste', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.RastesEnName = Center.RastesEnName.filter(en => en !== removedRaste.enName);
                Center.Rastes = Center.Rastes.filter(ct => ct.enName !== removedRaste.enName);
                Center.RastesRef.remove(removedRaste._id);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ Raste: removedRaste, CenterLength: resp.length }));
          } else {
            return res.json({ Raste: removedRaste, CenterLength: 0 });
          }
        });
    })
    .catch(err => {
      return res.status(422).send({ error: "anjam neshod" });
    });
};
