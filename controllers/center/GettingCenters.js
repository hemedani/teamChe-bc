const mongoose = require("mongoose");
const _ = require("lodash");
const Center = require("../../models/Center");
const City = require("../../models/City");

exports.centersCount = async (_, res) => {
  const count = await Center.countDocuments();
  return res.send({ CentersCount: count });
};

exports.centers = (req, res) => {
  // console.log(req.query);

  let query = {};
  req.query._id
    ? (query._id = { $lt: mongoose.Types.ObjectId(req.query._id) })
    : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (req.query.rastes) {
    let rastes = [];
    Array.isArray(req.query.rastes) ? (rastes = rastes.concat(req.query.rastes)) : rastes.push(req.query.rastes);
    query.rastesEnName = { $in: rastes };
  }
  if (req.query.wareTypes) {
    let wareTypes = [];
    Array.isArray(req.query.wareTypes)
      ? (wareTypes = wareTypes.concat(req.query.wareTypes))
      : wareTypes.push(req.query.wareTypes);
    query.wareTypesEnName = { $in: wareTypes };
  }
  req.query.premium == "true" || req.query.premium === true ? (query.premium = req.query.premium) : (query = query);
  req.query.online == "true" || req.query.online === true ? (query.online = req.query.online) : (query = query);
  req.query.city ? (query.cityName = req.query.city) : (query = query);

  req.query.name ? (query = { ...query, name: { $regex: req.query.name } }) : (query = query);
  req.query.enName ? (query = { ...query, enName: { $regex: req.query.enName } }) : (query = query);
  req.query.address ? (query = { ...query, address: { $regex: req.query.address } }) : (query = query);
  req.query.etehadiye ? (query = { ...query, etehadiye: req.query.etehadiye }) : (quer = query);
  // console.log("query baad az doros shodan", query);
  // console.log("=======================");

  Center.find(query)
    .limit(30)
    .sort({ _id: -1 })
    .exec()
    .then(centers => res.json({ centers }))
    .catch(err => res.status(422).send({ error: "we have an issues" }));
};

exports.getCentersWithParams = (req, res) => {
  // console.log('req.query az getCentersWithParams', req.query);
  // console.log('=======================');

  let limit = _.parseInt(req.query.limit) || 30;
  let page = Math.ceil(_.parseInt(req.query.page - 1)) || 0;
  if (page < 0) page = 0;

  if (req.query.lat && req.query.lng) {
    let query = {};

    if (req.query.rastes) {
      let rastes = [];
      // console.log('Array.isArray(req.query.rastes)', Array.isArray(req.query.rastes));
      Array.isArray(req.query.rastes) ? (rastes = rastes.concat(req.query.rastes)) : rastes.push(req.query.rastes);
      query.rastesEnName = { $in: rastes };
    }
    req.query.wareType ? (query.wareTypesEnName = req.query.wareType) : (query = query);
    req.query.premium == "true" || req.query.premium === true ? (query.premium = req.query.premium) : (query = query);
    req.query.onlineShop == "true" || req.query.onlineShop === true
      ? (query.onlineShop = req.query.onlineShop)
      : (query = query);

    req.query.name ? Object.assign(query, { name: { $regex: req.query.name } }) : (query = query);
    req.query.enName ? Object.assign(query, { enName: { $regex: req.query.enName } }) : (query = query);

    req.query.city ? (query.cityName = req.query.city) : (query = query);

    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.query.lng, req.query.lat]
        }
      }
    };

    Center.find(query)
      .skip(limit * page)
      .limit(limit)
      .exec()
      .then(centers => res.json({ centers }))
      .catch(err => res.status(422).send({ error: "we have an issues" }));
  } else if (req.query.sort) {
    let sort = {};
    let query = {};
    if (req.query.sort === "expertRate") sort = { expertRate: -1 };
    if (req.query.sort === "peopleRate") sort = { "TotalPeopleRate.average": -1 };
    if (req.query.sort === "likes") sort = { likes: -1 };
    if (req.query.sort === "discount") sort = { discount: -1 };

    if (req.query.rastes) {
      let rastes = [];
      // console.log('Array.isArray(req.query.rastes)', Array.isArray(req.query.rastes));
      Array.isArray(req.query.rastes) ? (rastes = rastes.concat(req.query.rastes)) : rastes.push(req.query.rastes);
      query.rastesEnName = { $in: rastes };
    }
    req.query.wareType ? (query.wareTypesEnName = req.query.wareType) : (query = query);
    req.query.premium == "true" || req.query.premium === true ? (query.premium = req.query.premium) : (query = query);
    req.query.onlineShop == "true" || req.query.onlineShop === true
      ? (query.onlineShop = req.query.onlineShop)
      : (query = query);
    query.cityName = req.query.city || "Tehran";

    req.query.name ? Object.assign(query, { name: { $regex: req.query.name } }) : (query = query);
    req.query.enName ? Object.assign(query, { enName: { $regex: req.query.enName } }) : (query = query);

    Center.find(query)
      .skip(limit * page)
      .limit(limit)
      .sort(sort)
      .exec()
      .then(centers => {
        if (req.query.cityId) {
          City.findById(req.query.cityId)
            .exec()
            .then(city => res.json({ centers, city }));
        } else {
          let cityEn = req.query.city || "Tehran";
          City.findOne({ enName: cityEn })
            .exec()
            .then(city => res.json({ centers, city }));
        }
      })
      .catch(err => res.status(422).send({ error: "we have an issues" }));
  } else {
    // console.log(req.query.rastes)

    const idm = mongoose.Types.ObjectId(req.query.id);

    let query = {};
    req.query.id
      ? (query._id = { $lt: mongoose.Types.ObjectId(req.query.id) })
      : (query._id = { $lt: mongoose.Types.ObjectId() });
    if (req.query.rastes) {
      let rastes = [];
      // console.log('Array.isArray(req.query.rastes)', Array.isArray(req.query.rastes));
      Array.isArray(req.query.rastes) ? (rastes = rastes.concat(req.query.rastes)) : rastes.push(req.query.rastes);
      query.rastesEnName = { $in: rastes };
    }
    req.query.wareType ? (query.wareTypesEnName = req.query.wareType) : (query = query);
    req.query.premium == "true" || req.query.premium === true ? (query.premium = req.query.premium) : (query = query);
    req.query.onlineShop == "true" || req.query.onlineShop === true
      ? (query.onlineShop = req.query.onlineShop)
      : (query = query);
    query.cityName = req.query.city || "Tehran";
    // console.log('query baad az doros shodan', query);
    // console.log('=======================');

    req.query.name ? Object.assign(query, { name: { $regex: req.query.name } }) : (query = query);
    req.query.enName ? Object.assign(query, { enName: { $regex: req.query.enName } }) : (query = query);

    Center.find(query)
      .limit(limit)
      .sort({ _id: -1 })
      .exec()
      .then(centers => {
        if (req.query.cityId) {
          City.findById(req.query.cityId)
            .exec()
            .then(city => res.json({ centers, city }));
        } else {
          let cityEn = req.query.city || "Tehran";
          City.findOne({ enName: cityEn })
            .exec()
            .then(city => res.json({ centers, city }));
        }
      })
      .catch(err => res.status(422).send({ error: "we have an issues" }));
  }
};

exports.center = (req, res) => {
  // console.log("req.query az exports.center", req.query);
  // console.log('req.headers az exports.center', req.headers)

  Center.findById(req.query._id)
    .populate("raste etehadiye otaghAsnaf otaghBazargani")
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.getEditedCenter = (req, res) => {
  // console.log('req.query az exports.center', req.query)
  // console.log('req.headers az exports.center', req.headers)

  Center.findById(req.query.centerId)
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
