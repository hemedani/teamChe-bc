const mongoose = require("mongoose");
var _ = require("lodash");
const OtaghBazargani = require("../models/OtaghBazargani");
const Center = require("../models/Center");

exports.addOtaghBazargani = (req, res, next) => {
  // console.log('req.body az addOtaghBazargani OtaghBazarganiController', req.body);

  const { name, enName, city, state, pic, picRef } = req.body;

  const OtaghBazargani = new OtaghBazargani({
    name,
    enName,

    city,
    state,

    pic,
    picRef,
    creator: req.user._id
  });

  OtaghBazargani.save()
    .then(OtaghBazarganiSaved => res.json({ OtaghBazargani: OtaghBazarganiSaved }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.OtaghBazarganis = (req, res) => {
  OtaghBazargani.find()
    .select("name enName pic")
    .exec()
    .then(OtaghBazarganis => res.json({ OtaghBazarganis }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.updateOtaghBazargani = (req, res) => {
  // console.log('req.body az yourOtaghBazargani', req.body)

  const { _id, name, enName } = req.body;

  OtaghBazargani.findOneAndUpdate({ _id: _id }, { name: name, enName: enName })
    .exec()
    .then(OtaghBazarganiUpdated => {
      // console.log('OtaghBazarganiUpdated.enName ', OtaghBazarganiUpdated)

      let OtaghBazargani = { _id: OtaghBazarganiUpdated._id, name: name, enName: enName, pic: OtaghBazarganiUpdated.pic };

      Center.find({ OtaghBazarganisRef: OtaghBazargani._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateOtaghBazargani', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.OtaghBazarganisEnName = Center.OtaghBazarganisEnName.filter(
                  en => en !== OtaghBazarganiUpdated.enName
                );
                Center.OtaghBazarganis = Center.OtaghBazarganis.filter(ct => ct.enName !== OtaghBazarganiUpdated.enName);

                Center.OtaghBazarganisEnName.push(OtaghBazargani.enName);
                Center.OtaghBazarganis.push(OtaghBazargani);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ OtaghBazargani: OtaghBazargani, CenterLength: resp.length }));
          } else {
            return res.json({ OtaghBazargani: OtaghBazargani, CenterLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved" }));
};

exports.removeOtaghBazargani = (req, res) => {
  // console.log('req.body az removeOtaghBazargani :', req.body);
  OtaghBazargani.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedOtaghBazargani => {
      console.log(removedOtaghBazargani);

      Center.find({ OtaghBazarganisRef: removedOtaghBazargani._id })
        .exec()
        .then(CenterFinded => {
          // let Centers = CenterFinded._doc;
          // console.log('az to Center.find updateOtaghBazargani', Centers);
          if (CenterFinded.length > 0) {
            Promise.all(
              CenterFinded.map(Center => {
                Center.OtaghBazarganisEnName = Center.OtaghBazarganisEnName.filter(
                  en => en !== removedOtaghBazargani.enName
                );
                Center.OtaghBazarganis = Center.OtaghBazarganis.filter(ct => ct.enName !== removedOtaghBazargani.enName);
                Center.OtaghBazarganisRef.remove(removedOtaghBazargani._id);

                return Center.save().then(CenterSaved => CenterSaved);
              })
            ).then(resp => res.json({ OtaghBazargani: removedOtaghBazargani, CenterLength: resp.length }));
          } else {
            return res.json({ OtaghBazargani: removedOtaghBazargani, CenterLength: 0 });
          }
        });
    })
    .catch(err => {
      return res.status(422).send({ error: "anjam neshod" });
    });
};
