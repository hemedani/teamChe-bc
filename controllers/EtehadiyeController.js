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

exports.Etehadiyes = (_, res) => {
  Etehadiye.find()
    .exec()
    .then(etehadiyes => res.json({ etehadiyes }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
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
        if (cValue.officerEt) {
          pValue[cValue.officerEt] = pValue[cValue.officerEt] || [];
          pValue[cValue.officerEt].push(cValue._id);
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
        findedEt.officers.map(ofId => User.findOneAndUpdate({ _id: ofId }, { officerEt: null }, { new: true }))
      );

      await Promise.all(usersId.map(ofId => User.findOneAndUpdate({ _id: ofId }, { officerEt: null }, { new: true })));

      const updatedEt = await Etehadiye.findOneAndUpdate({ _id }, { officers: usersId }, { new: true });

      const updatedUsers = await Promise.all(
        usersId.map(userId => User.findOneAndUpdate({ _id: userId }, { officerEt: _id }, { new: true }))
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
