const Center = require("../../models/Center");
const Etehadiye = require("../../models/Etehadiye");
const Report = require("../../models/Report");
const State = require("../../models/State");
const City = require("../../models/City");

const SendSMS = require("../../service/SendSMS");

const Utils = require("./utils/CenterUtils");

const { updateStaticMap } = Utils;

exports.addCenter = async (req, res) => {
  // Income :: Method : post ---- need( in req.body) :
  // Output :: Method: json ---- { center: {'---refer to it's model for props---'} }

  // console.log("==================");
  // console.log("req.body from CenterController addCenter", req.body);
  // console.log("==================");

  let {
    guildId,
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

    lat,
    lng,

    picsUploaded,
    etPic
  } = req.body;
  address.text = text;

  if (!guildId) {
    return res.status(500).send({ error: "بدون شناسه صنفی نمیتوانید مرکز اضافه کنید" });
  }

  const fundedCenterByGuildId = await Center.findOne({ guildId }).exec();

  if (fundedCenterByGuildId) {
    return res.status(500).send({ error: "این شناسه صنفی قبلا وارد شده است" });
  }

  let pics = [],
    picsRef = [];

  picsUploaded.map(pi => {
    pics.push(pi.name);
    picsRef.push(pi._id);
  });

  let center = new Center({
    guildId,
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

    pics,
    picsRef,

    etPic,

    address,
    fullPath: `${name}, ${address.state} - ${address.city} - ${address.parish} - ${text}`,
    location: { type: "Point", coordinates: [lng, lat] },

    creator: req.user._id
  });

  if (startWork && endWork) {
    center.workShift = [startWork, endWork];
  }

  center.staticMap = await updateStaticMap(lat, lng);

  center
    .save()
    .then(async savedCenter => {
      const etCenterCount = await Center.countDocuments({ etehadiye: savedCenter.etehadiye });

      if (Number(etCenterCount) > 20) {
        await Etehadiye.findOneAndUpdate({ _id: savedCenter.etehadiye }, { $inc: { credit: -10000 } }).exec();
      }
      return res.json({ center: savedCenter });
    })
    .catch(err => res.status(422).send({ error: "We have an issues", err }));
};

exports.addPicToCenter = (req, res) => {
  // console.log(req.body);
  Center.findById(req.body._id)
    .exec()
    .then(centerFind => {
      let picsUploaded = req.body.picsUploaded || [],
        pics = [],
        picsRef = [],
        oldPics = centerFind.pics || [],
        oldPicsRef = centerFind.picsRef || [];

      picsUploaded.map(pi => {
        pics.push(pi.name);
        picsRef.push(pi._id);
      });
      centerFind.pics = [...oldPics, ...pics];
      centerFind.picsRef = [...oldPicsRef, ...picsRef];

      centerFind.save().then(centerSaved => res.json({ center: centerSaved }));
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addOptions = (req, res) => {
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
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addCenterByOfficer = async (req, res) => {
  let {
    name,
    personType,
    activityType,
    postalCode,
    guildOwnerName,
    guildOwnerFamily,
    ownerFatherName,
    nationalCode,
    guildOwnerPhoneNumber,
    raste,
    parish,
    address,
    lat,
    lng
  } = req.body;

  const foundedEt = await Etehadiye.findById(req.user.etOrganization).exec();

  if (foundedEt) {
    const { _id, otaghAsnaf, otaghBazargani, city, state, pic } = foundedEt;

    const foundedState = await State.findById(state).exec();
    const foundedCity = await City.findById(city).exec();

    address.state = foundedState.name;
    address.city = foundedCity.name;

    let center = new Center({
      name,
      personType,
      activityType,
      postalCode,
      guildOwnerName,
      guildOwnerFamily,
      ownerFatherName,
      nationalCode,
      guildOwnerPhoneNumber,
      guildStatus: "warning27",
      warning27Date: new Date(),

      raste,
      parish,
      address,
      fullPath: `${name}, ${address.state} - ${address.city} - ${address.parish} - ${address.text}`,
      location: { type: "Point", coordinates: [lng, lat] },

      otaghAsnaf,
      otaghBazargani,
      city,
      state,
      etPic: pic,
      etehadiye: _id
    });
    center.staticMap = await updateStaticMap(lat, lng);
    const report = new Report({
      subject: "اخطار ماده ۲۷",
      text: "این اخطار صرفا جهت آزمایش نوشته شده است",
      raste,
      etehadiye: _id,
      otaghAsnaf,
      otaghBazargani,
      state,
      city,
      parish,
      center: center._id,
      creator: req.user._id
    });

    const phoneNumbers = [guildOwnerPhoneNumber];

    if (process.env.ENVIREMENT === "production") {
      SendSMS.sendCustomMsg(
        phoneNumbers,
        "یک اخطار برای تشکیل پرونده در اتحادیه پوشاک برای شما ایجاد شد لطفا به اتحادیه مراجعه کنید"
      );
    }

    await report.save();
    center
      .save()
      .then(savedCenter => res.json({ center: savedCenter }))
      .catch(err => res.status(422).send({ error: "We have an issues", err }));
  } else {
    return res.status(422).send({ error: "We have an issues" });
  }
};
