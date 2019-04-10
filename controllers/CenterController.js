const mongoose = require("mongoose");
var _ = require("lodash");
const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");
const Center = require("../models/Center");
const Raste = require("../models/Raste");
const Rate = require("../models/Rate");
const Ware = require("../models/Ware");
const City = require("../models/City");
const exRate = require("../service/exRate").exRate;

const download = require("image-downloader");
const uuidv4 = require("uuid/v4");

exports.addCenter = (req, res) => {
  // Incom :: Method : post ---- need( in req.body) :
  // Ooutput :: Method: json ---- { center: {'---refer to it's model for props---'} }

  // let options = req.body.options || [], optionsEnName = [], optionsRef = [],
  //     wareTypes = req.body.wareTypes || [], wareTypesEnName = [], wareTypesRef = [],
  //     rastes = req.body.rastes || [], rastesEnName = [], rastesRef = [],
  //     labels = req.body.labels || [], labelsEnName = [], labelsRef = [],
  //     picsUploaded = req.body.picsUploaded || [], pic = [], picRef = [];

  // options.map((option) => { optionsEnName.push(option.enName); optionsRef.push(option._id) })
  // wareTypes.map((wareType) => { wareTypesEnName.push(wareType.enName); wareTypesRef.push(wareType._id) })
  // rastes.map((raste) => { rastesEnName.push(raste.enName); rastesRef.push(raste._id) })
  // labels.map((label) => { labelsEnName.push(label.enName); labelsRef.push(label._id) })
  // picsUploaded.map((pi) => { pic.push(pi.name); picRef.push(pi._id) })

  // let center = new Center({
  //   name: req.body.name,
  //   enName: req.body.enName,
  //   cityName: req.body.city.enName,
  //   description: req.body.description,

  //   telegram: req.body.telegram,
  //   instagram: req.body.instagram,
  //   email: req.body.email,
  //   website: req.body.website,

  //   options: options || [],
  //   wareTypes: wareTypes || [],
  //   rastes: rastes || [],
  //   labels: labels || [],

  //   optionsEnName: optionsEnName || [],
  //   wareTypesEnName: wareTypesEnName || [],
  //   rastesEnName: rastesEnName || [],
  //   labelsEnName: labelsEnName || [],

  //   optionsRef: optionsRef || [],
  //   wareTypesRef: wareTypesRef || [],
  //   rastesRef: rastesRef || [],
  //   labelsRef: labelsRef || [],

  //   discount: req.body.discount || 0,
  //   phone: req.body.phone || [],
  //   onlineShop: req.body.onlineShop || false,
  //   pic: pic,
  //   picRef: picRef,
  //   premium: req.body.premium || false,
  //   address: req.body.address || '',
  //   city: { name: req.body.city.name, enName: req.body.city.enName, location: req.body.city.location },
  //   cityRef: req.body.city._id,
  //   location: { type: 'Point', coordinates: [req.body.lng, req.body.lat] },
  //   creator: req.user._id
  // });

  // if (req.body.startWork && req.body.endWork) {
  //   center.workShift = [req.body.startWork, req.body.endWork]
  // }

  // if (req.body.user) center.doctor = req.body.user;

  // const staticMapImgName = `${uuidv4()}.png`

  // const mapOptions = {
  //   url: `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${req.body.lat},${req.body.lng}&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pinteb.ir/static/img/pin.png%7C${req.body.lat},${req.body.lng}&key=AIzaSyCPfDQXNU5sl3Ar7gfy-CSbWijyHJ2mjrY`,
  //   dest: `./pic/maps/${staticMapImgName}`
  // }

  // download.image(mapOptions)
  //   .then(({ filename, image }) => {
  //     center.staticMap = staticMapImgName;

  //     center.save()
  //       .then((centerSaved) => res.json({ center: centerSaved }))
  //   })
  //   .catch((err) => res.status(422).send({error: 'anjam neshod', err}))picsUploaded.map((pi) => { pic.push(pi.name); picRef.push(pi._id) })

  console.log("==================");
  console.log("req.body from CenterController", req.body);
  console.log("==================");

  let {
    name,
    enName,
    discount,
    premium,
    onlineShop,
    address,
    desctiption,
    telegram,
    instagram,
    email,
    website,

    text,

    startWork,
    endWork,

    state,
    city,
    parish,
    otaghBazargani,
    otaghAsnaf,
    etehadiye,

    lat,
    lng,

    picsUploaded
  } = req.body;
  address.text = text;

  let pics = [],
    picsRef = [];

  picsUploaded.map(pi => {
    pics.push(pi.name);
    picsRef.push(pi._id);
  });

  let center = new Center({
    name,
    enName,
    discount,
    premium,
    onlineShop,
    address,
    desctiption,
    telegram,
    instagram,
    email,
    website,

    state,
    city,
    parish,
    otaghBazargani,
    otaghAsnaf,
    etehadiye,

    pics,
    picsRef,

    address,
    location: { type: "Point", coordinates: [lng, lat] },

    creator: req.user._id
  });

  if (startWork && endWork) {
    center.workShift = [startWork, endWork];
  }

  center
    .save()
    .then(centerSaved => res.json({ center: centerSaved }))
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.fixCity = (req, res) => {
  City.findOne({ enName: "Tehran" })
    .exec()
    .then(cityFind => {
      if (cityFind) {
        Center.update(
          { cityName: "Tehran" },
          { $set: { city: { location: cityFind.location, enName: "Tehran", name: "تهران" } }, cityRef: cityFind._id },
          { multi: true }
        )
          .exec()
          .then(resp => {
            console.log("az to Center.update", resp);
            return res.json({ resp });
          });
      }
    });
};

exports.CentersCount = async (req, res) => {
  const count = await Center.find().countDocuments();
  return res.send({ CentersCount: count });
};

exports.updateCenter = (req, res, next) => {
  // console.log('req.body az updateCenter CenterController', req.body);

  if (req.user.level !== "tarah" && req.user.level !== "admin") {
    return res.status(500).send({ error: "you not have enough access right" });
  }

  let options = req.body.options || [],
    optionsEnName = [],
    optionsRef = [],
    wareTypes = req.body.wareTypes || [],
    wareTypesEnName = [],
    wareTypesRef = [],
    rastes = req.body.rastes || [],
    rastesEnName = [],
    rastesRef = [],
    labels = req.body.labels || [],
    labelsEnName = [],
    labelsRef = [];

  options.map(option => {
    optionsEnName.push(option.enName);
    optionsRef.push(option._id);
  });
  wareTypes.map(wareType => {
    wareTypesEnName.push(wareType.enName);
    wareTypesRef.push(wareType._id);
  });
  rastes.map(raste => {
    rastesEnName.push(raste.enName);
    rastesRef.push(raste._id);
  });
  labels.map(label => {
    labelsEnName.push(label.enName);
    labelsRef.push(label._id);
  });

  Center.findOneAndUpdate(
    { _id: req.body._id },
    {
      name: req.body.name,
      enName: req.body.enName,
      cityName: req.body.city.enName,
      description: req.body.description,

      telegram: req.body.telegram,
      instagram: req.body.instagram,
      email: req.body.email,
      website: req.body.website,

      options: options,
      wareTypes: wareTypes,
      rastes: rastes,
      labels: labels,

      optionsEnName: optionsEnName,
      wareTypesEnName: wareTypesEnName,
      rastesEnName: rastesEnName,
      labelsEnName: labelsEnName,

      optionsRef: optionsRef,
      wareTypesRef: wareTypesRef,
      rastesRef: rastesRef,
      labelsRef: labelsRef,

      premium: req.body.premium,
      discount: req.body.discount,
      phone: req.body.phone,
      onlineShop: req.body.onlineShop,
      address: req.body.address,
      city: { name: req.body.city.name, enName: req.body.city.name, location: req.body.city.location },
      cityRef: req.body.city._id,
      workShift: [req.body.startWork || 1, req.body.endWork || 24],
      location: { type: "Point", coordinates: [req.body.lng, req.body.lat] }
    },
    { new: true }
  )
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.centers = (req, res, next) => {
  // console.log(req.query);

  let idm = mongoose.Types.ObjectId(req.query.id);

  let query = {};
  req.query.id
    ? (query._id = { $lt: mongoose.Types.ObjectId(req.query.id) })
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
    .then(centers => {
      console.log("==================");
      console.log("centers", centers);
      console.log("==================");

      return res.json({ centers });
    })
    .catch(err => res.status(422).send({ error: "anjam neshod" }));
};

exports.getCentersWithParams = function(req, res, next) {
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
      .select(
        "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop pic location officeDoctors otherAdresses"
      )
      .exec()
      .then(centers => res.json({ centers }))
      .catch(err => res.status(422).send({ error: "anjam neshod" }));
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
      .select(
        "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop pic location officeDoctors otherAdresses"
      )
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
      .catch(err => res.status(422).send({ error: "anjam neshod" }));
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
      .select(
        "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop description pic location officeDoctors otherAdresses"
      )
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
      .catch(err => res.status(422).send({ error: "anjam neshod" }));
  }
};

exports.center = (req, res, next) => {
  // console.log('req.query az exports.center', req.query)
  // console.log('req.headers az exports.center', req.headers)

  Center.findById(req.query.id)
    .populate("doctor")
    .select(
      "name enName cityName description telegram instagram email website workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop pic staticMap location officeDoctors otherAdresses"
    )
    .exec()
    .then(center => {
      let editCenter = Object.assign({ hasLiked: false }, center._doc);
      let sabti = req.headers.sabti || null;
      sabti === "null" || sabti === "undefined" ? (sabti = null) : (sabti = sabti);
      if (sabti) {
        let decode = jwt.decode(req.headers.sabti, config.secret);
        User.findById(decode.sub)
          .exec()
          .then(userFind => {
            let isLiked = userFind.centersLiked.some(LikeId => LikeId.equals(center._id));
            if (isLiked) editCenter.hasLiked = true;
            return res.json({ center: editCenter });
          });
      } else {
        return res.json({ center: editCenter });
      }
    })
    .catch(err => res.status(422).send({ error: "anjam neshod" }));
};

exports.getEditedCenter = (req, res, next) => {
  // console.log('req.query az exports.center', req.query)
  // console.log('req.headers az exports.center', req.headers)

  Center.findById(req.query.centerId)
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.addQualityRate = function(req, res, next) {
  // console.log('req.body az addQualityRate', req.body)
  // console.log('req.user az addQualityRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.qualityRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.qualityRate', centerFind);
              centerFind.TotalQualityRate.total =
                centerFind.TotalQualityRate.total - rateFind.qualityRate + req.body.qualityRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = (
                  centerFind.TotalPeopleRate.total -
                  rateFind.qualityRate +
                  req.body.qualityRate
                ).toFixed(1);
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalQualityRate);
              rateFind.qualityRate = req.body.qualityRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalQualityRate.total) {
                centerFind.TotalQualityRate.total = centerFind.TotalQualityRate.total + req.body.qualityRate;
                centerFind.TotalQualityRate.count = centerFind.TotalQualityRate.count + 1;
              } else {
                centerFind.TotalQualityRate.total = req.body.qualityRate;
                centerFind.TotalQualityRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.qualityRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalQualityRate);
              rateFind.qualityRate = req.body.qualityRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              qualityRate: req.body.qualityRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalQualityRate.total) {
                // console.log('oftad to centerFind.TotalQualityRate');
                centerFind.TotalQualityRate.total = centerFind.TotalQualityRate.total + req.body.qualityRate;
                centerFind.TotalQualityRate.count = centerFind.TotalQualityRate.count + 1;
              } else {
                // console.log('centerFind.TotalQualityRate nadasht ----');
                centerFind.TotalQualityRate = { total: req.body.qualityRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.qualityRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalQualityRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => res.status(422).send({ error: "anjam neshod" }));
};

exports.addPriceRate = (req, res, next) => {
  console.log("req.body az addPriceRate", req.body);
  // console.log('req.user az addPriceRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.priceRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.priceRate', centerFind);
              centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total - rateFind.priceRate + req.body.priceRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total =
                  centerFind.TotalPeopleRate.total - rateFind.priceRate + req.body.priceRate;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalPriceRate);
              rateFind.priceRate = req.body.priceRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalPriceRate.total) {
                centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total + req.body.priceRate;
                centerFind.TotalPriceRate.count = centerFind.TotalPriceRate.count + 1;
              } else {
                centerFind.TotalPriceRate.total = req.body.priceRate;
                centerFind.TotalPriceRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.priceRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalPriceRate);
              rateFind.priceRate = req.body.priceRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              priceRate: req.body.priceRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalPriceRate.total) {
                // console.log('oftad to centerFind.TotalPriceRate');
                centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total + req.body.priceRate;
                centerFind.TotalPriceRate.count = centerFind.TotalPriceRate.count + 1;
              } else {
                // console.log('centerFind.TotalPriceRate nadasht ----');
                centerFind.TotalPriceRate = { total: req.body.priceRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.priceRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalPriceRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => {
      // console.log('oftad to error', err);
      return res.status(422).send({ error: "anjam neshod" });
    });
};

exports.addSalesmanRate = (req, res, next) => {
  // console.log('req.body az addSalesmanRate', req.body)
  // console.log('req.user az addSalesmanRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.salesmanRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.salesmanRate', centerFind);
              centerFind.TotalSalesmanRate.total =
                centerFind.TotalSalesmanRate.total - rateFind.salesmanRate + req.body.salesmanRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total =
                  centerFind.TotalPeopleRate.total - rateFind.salesmanRate + req.body.salesmanRate;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalSalesmanRate);
              rateFind.salesmanRate = req.body.salesmanRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalSalesmanRate.total) {
                centerFind.TotalSalesmanRate.total = centerFind.TotalSalesmanRate.total + req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = centerFind.TotalSalesmanRate.count + 1;
              } else {
                centerFind.TotalSalesmanRate.total = req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalSalesmanRate);
              rateFind.salesmanRate = req.body.salesmanRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              salesmanRate: req.body.salesmanRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalSalesmanRate.total) {
                // console.log('oftad to centerFind.TotalSalesmanRate');
                centerFind.TotalSalesmanRate.total = centerFind.TotalSalesmanRate.total + req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = centerFind.TotalSalesmanRate.count + 1;
              } else {
                // console.log('centerFind.TotalSalesmanRate nadasht ----');
                centerFind.TotalSalesmanRate = { total: req.body.salesmanRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalSalesmanRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => {
      // console.log('oftad to error', err);
      return res.status(422).send({ error: "anjam neshod" });
    });
};

exports.setExpertRate = (req, res, next) => {
  let rate = exRate(req.body.rate);
  Center.findByIdAndUpdate({ _id: req.body.id }, { expertRate: rate }, { new: true })
    .exec()
    .then(centerUpdated => res.json({ center: centerUpdated }))
    .catch(err => res.status(422).send({ error: "anjam neshod" }));
};

exports.addOptions = (req, res, next) => {
  if (req.user.level !== "tarah" && req.user.level !== "admin") {
    return res.status(500).send({ error: "you not have enough access right" });
  }

  let optionsEnName = [],
    optionsRef = [],
    options = req.body.options;

  if (options) {
    options.map(option => {
      optionsEnName.push(option.enName);
      optionsRef.push(option._id);
    });
  }

  Center.findByIdAndUpdate(
    { _id: req.body.id },
    {
      options: options,
      optionsEnName: optionsEnName,
      optionsRef: optionsRef
    },
    { new: true }
  )
    .exec()
    .then(centerUpdated => res.json({ center: centerUpdated }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
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
        .populate("doctor")
        .select(
          "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop description pic location officeDoctors otherAdresses"
        )
        .exec()
        .then(center => res.json({ center }));
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.removeAOtherAddFromCenter = (req, res, next) => {
  Center.findByIdAndUpdate({ _id: req.body.centerId }, { $pull: { otherAdresses: { _id: req.body.addId } } }, { new: true })
    .exec()
    .then(centerUpdated => res.send({ center: centerUpdated }))
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.setDoctor = (req, res, next) => {
  Center.findByIdAndUpdate({ _id: req.body.centerId }, { doctor: req.body.userId })
    .exec()
    .then(centerUpdated => {
      Center.findById(req.body.centerId)
        .populate("doctor")
        .select(
          "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop description pic location officeDoctors otherAdresses"
        )
        .exec()
        .then(center => res.json({ center }));
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.setOfficeDoctors = (req, res, next) => {
  // console.log('req.body setOfficeDoctors', req.body)
  let officeDoctors = req.body.officeDoctors || [],
    officeDoctorsRef = [];
  officeDoctors.map(ofdrs => officeDoctorsRef.push(ofdrs._id));

  Center.findByIdAndUpdate(
    { _id: req.body.centerId },
    { $push: { officeDoctors: { $each: officeDoctors }, officeDoctorsRef: { $each: officeDoctorsRef } } }
  )
    .exec()
    .then(centerUpdated => {
      Center.findById(req.body.centerId)
        .populate("doctor")
        .select(
          "name enName cityName workShift expertRate likes phone discount TotalQualityRate TotalPeopleRate TotalPriceRate TotalSalesmanRate options wareTypes rastes labels address premium onlineShop description pic location officeDoctors otherAdresses"
        )
        .exec()
        .then(center => res.json({ center }));
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.deleteDoctor = (req, res, next) => {
  Center.findByIdAndUpdate({ _id: req.body.centerId }, { doctor: null }, { new: true })
    .exec()
    .then(centerUpdated => {
      let center = centerUpdated._doc;

      delete center.optionsEnName;
      delete center.wareTypesEnName;
      delete center.rastesEnName;
      delete center.labelsEnName;

      delete center.wareTypesRef;
      delete center.rastesRef;
      delete center.optionsRef;
      delete center.labelsRef;

      delete center.picRef;
      delete center.creator;
      delete center.rateRef;
      delete center.cityRef;

      return res.json({ center });
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.setCenterLikes = (req, res, next) => {
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
      .catch(err => res.status(422).send({ error: "anjam neshod", err }));
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
      .catch(err => res.status(422).send({ error: "anjam neshod", err }));
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
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.removeCenter = (req, res, next) => {
  // console.log('req.body az removeCenter :', req.body);
  Center.findByIdAndRemove(req.body.id)
    .exec()
    .then(centerRemoved => {
      // console.log('centerRemoved az exports.removeCenter CenterController', centerRemoved)
      Rate.remove({ center: centerRemoved._id }).then(ratesRemoved => {
        // console.log('ratesRemoved az exports.removeCenter CenterController', ratesRemoved)
      });
      Ware.remove({ center: centerRemoved._id }).then(waresRemoved => {
        // console.log('waresRemoved az exports.removeCenter CenterController', waresRemoved)
      });
      return res.send("ba movafghiyat hazf shod");
    })
    .catch(err => res.status(422).send({ error: "anjam neshod" }));
};

exports.addPicToCenter = (req, res, next) => {
  // console.log(req.body)
  Center.findById(req.body._id)
    .exec()
    .then(centerFind => {
      let picsUploaded = req.body.picsUploaded || [],
        pic = [],
        picRef = [],
        oldPic = centerFind.pic || [],
        oldPicRef = centerFind.picRef || [];

      picsUploaded.map(pi => {
        pic.push(pi.name);
        picRef.push(pi._id);
      });
      centerFind.pic = [...oldPic, ...pic];
      centerFind.picRef = [...oldPicRef, ...picRef];

      centerFind.save().then(centerSaved => res.json({ center: centerSaved }));
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.deletePicCenter = (req, res, next) => {
  // console.log(req.body)
  Center.findById(req.body._id)
    .exec()
    .then(centerFind => {
      // const imgIndex = _.findIndex(centerFind.pic, req.body.pic)
      const imgIndex = centerFind.pic.indexOf(req.body.pic);

      const picRef = centerFind.picRef[imgIndex];
      console.log(imgIndex, picRef);

      Center.findOneAndUpdate({ _id: req.body._id }, { $pull: { pic: req.body.pic, picRef: picRef } }, { new: true })
        .exec()
        .then(centerUpdated => res.json({ center: centerUpdated }));

      // return res.json({ center: centerFind })
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.fixOfficDocters = (req, res, next) => {
  // console.log(req.body)
  Center.find()
    .exec()
    .then(centersFind => {
      Promise.all(
        centersFind.map(center => {
          // if (center.officeDoctorsRef.length > 0) {

          return Promise.all(
            center.officeDoctorsRef.map(EachOfDr => {
              return User.findById(EachOfDr)
                .exec()
                .then(EachOfDrFind => {
                  // let hasId = center.rastesRef.some(rasteRef => rasteRef.equals(rasteFind._id));
                  // if (!hasId) center.rastesRef.push(rasteFind._id)
                  return EachOfDrFind;
                });
            })
          ).then(resp => {
            // console.log('resp from fixOfficDocters EachOfDrFind.then ', resp)
            // let ofdrs = resp.map(ofdr => ({ pic: ofdr.pic, name: ofdr.name, familyName: ofdr.familyName, _id: ofdr._id}))
            center.officeDoctors = resp.map(ofdr => ({
              pic: ofdr.pic,
              name: ofdr.name,
              familyName: ofdr.familyName,
              _id: ofdr._id
            }));
            return center.save().then(centerSaved => {
              return centerSaved;
            });
          });

          // }
        })
      ).then(resp => {
        return res.json(resp.length);
      });
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};

exports.fixedStaticMaps = async (req, res) => {
  let limit = _.parseInt(req.query.limit) || 30;
  let page = Math.ceil(_.parseInt(req.query.page - 1)) || 0;
  if (page < 0) page = 0;

  const centers = await Center.find()
    .skip(limit * page)
    .limit(limit)
    .exec()
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));

  const cnmap = await Promise.all(
    centers.map(async center => {
      const staticMapImgName = `${uuidv4()}.png`;

      const mapOptions = {
        url: `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${center.location.coordinates[1]},${
          center.location.coordinates[0]
        }&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pinteb.ir/static/img/pin.png%7C${
          center.location.coordinates[1]
        },${center.location.coordinates[0]}&key=AIzaSyCPfDQXNU5sl3Ar7gfy-CSbWijyHJ2mjrY`,
        dest: `./pic/maps/${staticMapImgName}`
      };
      const downloadedMap = await download
        .image(mapOptions)
        .catch(err => res.status(422).send({ error: "anjam neshod", err }));
      center.staticMap = staticMapImgName;
      const savedCenter = await center.save();

      return savedCenter;
    })
  );

  return res.json({ length: cnmap.length, centers: cnmap });
};

// exports.fixedStaticMaps = (req, res) => {
//   // console.log(req.body)

//   let limit = _.parseInt(req.query.limit) || 30;
//   let page = Math.ceil(_.parseInt(req.query.page - 1)) || 0;
//   if (page < 0) page = 0;

//   Center.find()
//     .skip(limit * page)
//     .limit(limit)
//     .exec()
//     .then((centersFind) => {

//       Promise.all(centersFind.map((center) => {

//         const staticMapImgName = `${uuidv4()}.png`

//         const mapOptions = {
//           url: `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${center.location.coordinates[1]},${center.location.coordinates[0]}&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pinteb.ir/static/img/pin.png%7C${center.location.coordinates[1]},${center.location.coordinates[0]}&key=AIzaSyCPfDQXNU5sl3Ar7gfy-CSbWijyHJ2mjrY`,
//           dest: `./pic/maps/${staticMapImgName}`
//         }

//         return download.image(mapOptions)
//           .then(({ filename, image }) => {
//             center.staticMap = staticMapImgName;

//             return center.save()
//               .then((centerSaved) => centerSaved )
//           })

//       }))
//       .then((resp) => {
//         return res.json( resp.length )
//       })

//     })
//     .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
// }

exports.fixOtherAddressId = (req, res, next) => {
  // console.log(req.body)

  Center.find()
    .exec()
    .then(async centersFind => {
      let centerWithOtherAddress = [];
      centersFind.map(center => {
        if (center.otherAdresses.length > 0) {
          centerWithOtherAddress.push(center);
        }
      });
      const centerFixed = await Promise.all(
        centerWithOtherAddress.map(centerWOAmap => {
          centerWOAmap.otherAdresses.map(EachOtherAdd => {
            EachOtherAdd._id = mongoose.Types.ObjectId();
          });
          return centerWOAmap.save().then(centerWOAmapSaved => centerWOAmapSaved);
        })
      );
      return res.send({ centerFixed, centerFixedLength: centerFixed.length });
    })
    .catch(err => res.status(422).send({ error: "anjam neshod", err }));
};
