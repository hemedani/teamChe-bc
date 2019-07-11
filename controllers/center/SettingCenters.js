const mongoose = require("mongoose");
const download = require("image-downloader");
const uuidv4 = require("uuid/v4");

const User = require("../../models/user");
const Center = require("../../models/Center");
const Utils = require("./utils/CenterUtils");

const { updateStaticMap } = Utils;

exports.addOnePicToCenter = (req, res) => {
  Center.findOneAndUpdate({ _id: req.body._id }, { $push: { pics: req.pic.name, picsRef: req.pic._id } }, { new: true })
    .exec()
    .then(updatedCenter => res.send({ center: updatedCenter }));
};
exports.updateCenter = async (req, res) => {
  // console.log("req.body az updateCenter CenterController", req.body);

  let {
    name,
    enName,
    discount,
    premium,
    onlineShop,
    address,
    description,
    telegram,
    instagram,
    email,
    website,
    phone,

    text,

    startWork,
    endWork,

    state,
    city,
    parish,
    otaghBazargani,
    otaghAsnaf,
    etehadiye,
    raste,

    etPic,

    lat,
    lng
  } = req.body;
  address.text = text;
  const staticMap = await updateStaticMap(lat, lng);
  let updatedObj = {
    name,
    enName,
    discount,
    premium,
    onlineShop,
    address,
    description,
    telegram,
    instagram,
    email,
    website,
    phone,

    state,
    city,
    parish,
    otaghBazargani,
    otaghAsnaf,
    etehadiye,
    raste,

    etPic,

    address,
    fullPath: `${name}, ${address.state} - ${address.city} - ${address.parish} - ${text}`,
    location: { type: "Point", coordinates: [lng, lat] },
    staticMap
  };
  if (startWork && endWork) {
    updatedObj.workShift = [startWork, endWork];
  }

  Center.findOneAndUpdate({ _id: req.body._id }, updatedObj, { new: true })
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.setLocationForCenter = async (req, res) => {
  // console.log("==================");
  // console.log("req.body =>", req.body);
  // console.log("==================");

  const { _id, lat, lng } = req.body;

  const staticMap = `${uuidv4()}.png`;

  const mapOptions = {
    url: `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${lat},${lng}&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pasteboard.co/IagJJEM.png%7C${lat},${lng}&key=AIzaSyCPfDQXNU5sl3Ar7gfy-CSbWijyHJ2mjrY`,
    dest: `./pic/maps/${staticMap}`
  };

  await download.image(mapOptions);

  Center.findOneAndUpdate(
    { _id },
    {
      location: { type: "Point", coordinates: [lng, lat] },
      staticMap
    },
    { new: true }
  )
    .exec()
    .then(updatedCenter => res.send({ center: updatedCenter }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.setOtherAddresses = (req, res, next) => {
  Center.findByIdAndUpdate(
    { _id: req.body._id },
    {
      $push: {
        otherAdresses: {
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          address: req.body.address,
          phones: req.body.phones,
          location: { type: "Point", coordinates: [req.body.lng, req.body.lat] }
        }
      }
    }
  )
    .exec()
    .then(centerUpdated => {
      Center.findById(req.body._id)
        .exec()
        .then(center => res.json({ center }));
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.setCenterLikes = (req, res) => {
  let centerId = null;
  if (req.body.centerId) {
    centerId = req.body.centerId;
  } else if (req.query.centerId) {
    centerId = req.query.centerId;
  } else {
    return res.status(422).send({ error: "you must at least centerId in body or query" });
  }

  centerId = mongoose.Types.ObjectId(centerId);

  let hasLiked = req.user.centersLiked.some(cnId => cnId.equals(centerId));

  if (hasLiked) {
    User.findByIdAndUpdate(req.user._id, { $pull: { centersLiked: centerId } }, { new: true })
      .exec()
      .then(userUpd => {
        // console.log('pull centerId from req.user.centersLiked', userUpd)
        Center.findByIdAndUpdate(centerId, { $inc: { likes: -1 } }, { new: true }).then(centerUpd => {
          let editCenter = Object.assign({ hasLiked: false }, centerUpd._doc);
          delete editCenter.doctor;
          return res.json({ center: editCenter, user: userUpd });
        });
      })
      .catch(err => res.status(422).send({ error: "we have an issues", err }));
  } else {
    User.findByIdAndUpdate(req.user._id, { $push: { centersLiked: centerId } }, { new: true })
      .exec()
      .then(userUpd => {
        // console.log('push centerId to req.user.centersLiked', userUpd)
        Center.findByIdAndUpdate(centerId, { $inc: { likes: 1 } }, { new: true }).then(centerUpd => {
          let editCenter = Object.assign({ hasLiked: true }, centerUpd._doc);
          delete editCenter.doctor;
          return res.json({ center: editCenter, user: userUpd });
        });
      })
      .catch(err => res.status(422).send({ error: "we have an issues", err }));
  }
};

exports.setOwner = (req, res, next) => {
  Center.findByIdAndUpdate({ _id: req.body.centerId }, { owner: req.body.userId })
    .exec()
    .then(centerUpdated => {
      // console.log('centerUpdated when user set to owner from setOwner CenterController', centerUpdated)
      User.findByIdAndUpdate({ _id: req.body.userId }, { level: "owner", ownCenter: req.body.centerId })
        .exec()
        .then(resp => {
          // console.log('resp when user set to owner from setOwner CenterController', resp)
          Center.findById(req.body.centerId)
            .populate("doctor")
            .exec()
            .then(center => res.json({ center }));
        });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
