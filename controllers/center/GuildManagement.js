const Center = require("../../models/Center");

exports.protectedCenters = (req, res) => {
  // console.log("==================");
  // console.log("req.query from protectedCenters", req.query);
  // console.log("==================");

  let query = {},
    sort = {},
    page = 0,
    limit = 30;
  // req.query._id
  //   ? (query._id = { $lt: mongoose.Types.ObjectId(req.query._id) })
  //   : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (req.query.rastes && req.query.rastes.length > 0) query.raste = { $in: req.query.rastes };

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

  if (req.user.asOrganization) query.otaghAsnaf = req.user.asOrganization;
  if (req.user.etOrganization) query.etehadiye = req.user.etOrganization;

  req.query.name ? (query = { ...query, name: { $regex: req.query.name } }) : (query = query);
  req.query.enName ? (query = { ...query, enName: { $regex: req.query.enName } }) : (query = query);
  req.query.address ? (query = { ...query, address: { $regex: req.query.address } }) : (query = query);
  req.query.etehadiye ? (query = { ...query, etehadiye: req.query.etehadiye }) : (query = query);
  if (req.query.text) query = { ...query, fullPath: { $regex: req.query.text } };
  if (req.query.guildStatus) query.guildStatus = req.query.guildStatus;
  if (req.query.geo) {
    const geo = JSON.parse(req.query.geo);
    if (geo.coordinates) {
      query = {
        ...query,
        location: {
          $geoWithin: {
            $geometry: geo
          }
        }
      };
    }
  }
  if (req.query.near) {
    const near = JSON.parse(req.query.near);
    if (near.coordinates) {
      query = {
        ...query,
        location: {
          $near: {
            $geometry: near
          }
        }
      };
    }
  }

  if (req.query.sort) sort = JSON.parse(req.query.sort);
  if (req.query.page) page = req.query.page;

  // console.log("==================");
  // console.log("query - limit, sort, page from protectedCenters :> ", JSON.stringify(query, null, 2), limit, sort, page);
  // console.log("==================");

  Center.find(query)
    .limit(limit)
    .skip(page * limit)
    .sort(sort)
    .exec()
    .then(centers => res.json({ centers }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.updateProtectedCenter = (req, res) => {
  // console.log("==================");
  // console.log("req.body from updateProtected Center", req.body);
  // console.log("==================");

  let {
    _id,
    name,
    discount,
    description,
    telegram,
    instagram,
    email,
    website,

    guildId,
    issueDate,
    expirationDate,
    steward,
    personType,
    activityType,
    isicCode,
    postalCode,
    guildOwnerPhoneNumber,

    guildOwnerName,
    guildOwnerFamily,
    identificationCode,
    nationalCode,
    ownerFatherName,
    ownerBirthDate,

    waterPlaque,
    registrationPlaque,

    membershipFeeDate
  } = req.body;

  let updatedObj = {};

  if (name) updatedObj.name = name;
  if (discount) updatedObj.discount = discount;
  if (description) updatedObj.description = description;
  if (telegram) updatedObj.telegram = telegram;
  if (instagram) updatedObj.instagram = instagram;
  if (email) updatedObj.email = email;
  if (website) updatedObj.website = website;
  if (guildId) updatedObj.guildId = guildId;
  if (steward) updatedObj.steward = steward;
  if (personType) updatedObj.personType = personType;
  if (activityType) updatedObj.activityType = activityType;
  if (isicCode) updatedObj.isicCode = isicCode;
  if (postalCode) updatedObj.postalCode = postalCode;
  if (guildOwnerPhoneNumber) updatedObj.guildOwnerPhoneNumber = guildOwnerPhoneNumber;
  if (guildOwnerName) updatedObj.guildOwnerName = guildOwnerName;
  if (guildOwnerFamily) updatedObj.guildOwnerFamily = guildOwnerFamily;
  if (identificationCode) updatedObj.identificationCode = identificationCode;
  if (nationalCode) updatedObj.nationalCode = nationalCode;
  if (ownerFatherName) updatedObj.ownerFatherName = ownerFatherName;
  if (waterPlaque) updatedObj.waterPlaque = waterPlaque;
  if (registrationPlaque) updatedObj.registrationPlaque = registrationPlaque;

  if (membershipFeeDate) updatedObj.membershipFeeDate = membershipFeeDate;
  if (issueDate) updatedObj.issueDate = issueDate;
  if (expirationDate) updatedObj.expirationDate = expirationDate;
  if (ownerBirthDate) updatedObj.ownerBirthDate = ownerBirthDate;

  Center.findOneAndUpdate({ _id }, updatedObj, { new: true })
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addBusinessLicense = (req, res) => {
  // console.log("==================");
  // console.log("req.body from addBusinessLicense CenterController => ", req.body);
  // console.log("==================");

  const {
    _id,
    licensePic,
    licensePicRef,
    issueDate,
    expirationDate,
    steward,
    personType,
    activityType,
    isicCode,
    postalCode,
    guildOwnerName,
    guildDegree,
    guildOwnerFamily,
    identificationCode,
    nationalCode,
    ownerFatherName,
    ownerBirthDate,
    waterPlaque,
    registrationPlaque,
    membershipFeeDate,
    guildOwnerPhoneNumber
  } = req.body;

  let updateObj = {};
  if (licensePic) updateObj.licensePic = licensePic;
  if (licensePicRef) updateObj.licensePicRef = licensePicRef;
  if (issueDate) updateObj.issueDate = issueDate;
  if (expirationDate) updateObj.expirationDate = expirationDate;
  if (steward) updateObj.steward = steward;
  if (personType) updateObj.personType = personType;
  if (activityType) updateObj.activityType = activityType;
  if (isicCode) updateObj.isicCode = isicCode;
  if (postalCode) updateObj.postalCode = postalCode;
  if (guildOwnerName) updateObj.guildOwnerName = guildOwnerName;
  if (guildDegree) updateObj.guildDegree = guildDegree;
  if (guildOwnerFamily) updateObj.guildOwnerFamily = guildOwnerFamily;
  if (identificationCode) updateObj.identificationCode = identificationCode;
  if (nationalCode) updateObj.nationalCode = nationalCode;
  if (ownerFatherName) updateObj.ownerFatherName = ownerFatherName;
  if (ownerBirthDate) updateObj.ownerBirthDate = ownerBirthDate;
  if (waterPlaque) updateObj.waterPlaque = waterPlaque;
  if (registrationPlaque) updateObj.registrationPlaque = registrationPlaque;
  if (membershipFeeDate) updateObj.membershipFeeDate = membershipFeeDate;
  if (guildOwnerPhoneNumber) updateObj.guildOwnerPhoneNumber = guildOwnerPhoneNumber;

  Center.findOneAndUpdate({ _id }, updateObj, { new: true })
    .then(updatedCenter => res.send({ center: updatedCenter }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addLicensePic = (req, res) => {
  // console.log(req.body);
  const { _id, licensePic, licensePicRef } = req.body;

  Center.findOneAndUpdate({ _id }, { licensePic, licensePicRef }, { new: true })
    .exec()
    .then(center => res.json({ center }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
