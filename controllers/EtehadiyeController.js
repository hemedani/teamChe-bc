const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const Etehadiye = require("../models/Etehadiye");
const Center = require("../models/Center");

exports.addEtehadiye = (req, res, next) => {
  // console.log('req.body az addEtehadiye EtehadiyeController', req.body);

  const { name, enName, otaghAsnaf, otaghBazargani, city, state, pic, picRef } = req.body;

  const Etehadiye = new Etehadiye({
    name,
    enName,

    otaghAsnaf,
    otaghBazargani,

    city,
    state,

    pic,
    picRef,
    creator: req.user._id
  });

  Etehadiye.save()
    .then(EtehadiyeSaved => res.json({ Etehadiye: EtehadiyeSaved }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.Etehadiyes = (req, res) => {
  Etehadiye.find()
    .select("name enName pic")
    .exec()
    .then(Etehadiyes => res.json({ Etehadiyes }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.updateEtehadiye = (req, res) => {
  // console.log('req.body az yourEtehadiye', req.body)

  const { _id, name, enName } = req.body;

  Etehadiye.findOneAndUpdate({ _id: _id }, { name: name, enName: enName })
    .exec()
    .then(EtehadiyeUpdated => {
      // console.log('EtehadiyeUpdated.enName ', EtehadiyeUpdated)

      let Etehadiye = { _id: EtehadiyeUpdated._id, name: name, enName: enName, pic: EtehadiyeUpdated.pic };

      Center.find({ EtehadiyesRef: Etehadiye._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateEtehadiye', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.EtehadiyesEnName = Center.EtehadiyesEnName.filter(en => en !== EtehadiyeUpdated.enName);
                Center.Etehadiyes = Center.Etehadiyes.filter(ct => ct.enName !== EtehadiyeUpdated.enName);

                Center.EtehadiyesEnName.push(Etehadiye.enName);
                Center.Etehadiyes.push(Etehadiye);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ Etehadiye: Etehadiye, CenterLength: resp.length }));
          } else {
            return res.json({ Etehadiye: Etehadiye, CenterLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved" }));
};

exports.removeEtehadiye = (req, res) => {
  // console.log('req.body az removeEtehadiye :', req.body);
  Etehadiye.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedEtehadiye => {
      console.log(removedEtehadiye);

      Center.find({ EtehadiyesRef: removedEtehadiye._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateEtehadiye', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.EtehadiyesEnName = Center.EtehadiyesEnName.filter(en => en !== removedEtehadiye.enName);
                Center.Etehadiyes = Center.Etehadiyes.filter(ct => ct.enName !== removedEtehadiye.enName);
                Center.EtehadiyesRef.remove(removedEtehadiye._id);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ Etehadiye: removedEtehadiye, CenterLength: resp.length }));
          } else {
            return res.json({ Etehadiye: removedEtehadiye, CenterLength: 0 });
          }
        });
    })
    .catch(err => {
      return res.status(422).send({ error: "anjam neshod" });
    });
};
