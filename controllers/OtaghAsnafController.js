const mongoose = require("mongoose");
var _ = require("lodash");
const OtaghAsnaf = require("../models/OtaghAsnaf");
const Center = require("../models/Center");

exports.addOtaghAsnaf = (req, res, next) => {
  // console.log('req.body az addOtaghAsnaf OtaghAsnafController', req.body);

  const { name, enName, otaghBazargani, city, state, pic, picRef } = req.body;

  const OtaghAsnaf = new OtaghAsnaf({
    name,
    enName,

    otaghBazargani,

    city,
    state,

    pic,
    picRef,
    creator: req.user._id
  });

  OtaghAsnaf.save()
    .then(OtaghAsnafSaved => res.json({ OtaghAsnaf: OtaghAsnafSaved }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.OtaghAsnafs = (req, res) => {
  OtaghAsnaf.find()
    .select("name enName pic")
    .exec()
    .then(OtaghAsnafs => res.json({ OtaghAsnafs }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.updateOtaghAsnaf = (req, res) => {
  // console.log('req.body az yourOtaghAsnaf', req.body)

  const { _id, name, enName } = req.body;

  OtaghAsnaf.findOneAndUpdate({ _id: _id }, { name: name, enName: enName })
    .exec()
    .then(OtaghAsnafUpdated => {
      // console.log('OtaghAsnafUpdated.enName ', OtaghAsnafUpdated)

      let OtaghAsnaf = { _id: OtaghAsnafUpdated._id, name: name, enName: enName, pic: OtaghAsnafUpdated.pic };

      Center.find({ OtaghAsnafsRef: OtaghAsnaf._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateOtaghAsnaf', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.OtaghAsnafsEnName = Center.OtaghAsnafsEnName.filter(en => en !== OtaghAsnafUpdated.enName);
                Center.OtaghAsnafs = Center.OtaghAsnafs.filter(ct => ct.enName !== OtaghAsnafUpdated.enName);

                Center.OtaghAsnafsEnName.push(OtaghAsnaf.enName);
                Center.OtaghAsnafs.push(OtaghAsnaf);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ OtaghAsnaf: OtaghAsnaf, CenterLength: resp.length }));
          } else {
            return res.json({ OtaghAsnaf: OtaghAsnaf, CenterLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved" }));
};

exports.removeOtaghAsnaf = (req, res) => {
  // console.log('req.body az removeOtaghAsnaf :', req.body);
  OtaghAsnaf.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedOtaghAsnaf => {
      console.log(removedOtaghAsnaf);

      Center.find({ OtaghAsnafsRef: removedOtaghAsnaf._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateOtaghAsnaf', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.OtaghAsnafsEnName = Center.OtaghAsnafsEnName.filter(en => en !== removedOtaghAsnaf.enName);
                Center.OtaghAsnafs = Center.OtaghAsnafs.filter(ct => ct.enName !== removedOtaghAsnaf.enName);
                Center.OtaghAsnafsRef.remove(removedOtaghAsnaf._id);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ OtaghAsnaf: removedOtaghAsnaf, CenterLength: resp.length }));
          } else {
            return res.json({ OtaghAsnaf: removedOtaghAsnaf, CenterLength: 0 });
          }
        });
    })
    .catch(err => {
      return res.status(422).send({ error: "anjam neshod" });
    });
};
