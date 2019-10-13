const mongoose = require("mongoose");
const jwt = require("jwt-simple");
const request = require("request");
const User = require("../models/user");
const config = require("../config");
const pnumber = require("pnumber");
const uuidV1 = require("uuid/v1");
const Tell = require("../service/telephone");
const _ = require("lodash");
const chaptcha = require("../service/grecaptcha");
const SendSMS = require("../service/SendSMS");

function tok(user) {
  const allan = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: allan }, config.secret);
}

exports.loginWithMob = (req, res) => {
  console.log("req.body az loginWithMob", req.body, pnumber.toEnglishDigits(req.body.phone));

  if (!req.body.phone) {
    return res.status(422).send({ error: "you most send your phone number!" });
  }

  let phone = pnumber.toEnglishDigits(req.body.phone);
  phone = Tell.phoneMobile(phone);

  if (phone === "number is not valid") {
    return res.status(422).send({ error: "your phone number is not ok!" });
  }

  User.findOne({ phone: phone })
    .exec()
    .then(async user => {
      const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
      const sms = "با سلام، کد شما در تیم چه : " + code;

      let respSms = null;

      // SendSMS.sendPattern(phone, code);

      if (process.env.ENVIREMENT === "production") {
        SendSMS.sendPattern(phone, code);
      }

      let codeShomareTimeOut = null;

      // codeShomareTimeOut = setTimeout(() => {
      //   befrestNotification(req.body.fcmToken, code.toString())
      // }, 900)

      let respone = {};
      if (process.env.ENVIREMENT === "development") {
        console.log("==================");
        console.log("code from login with mobb", code);
        console.log("==================");

        respone.code = code;
      }

      if (user) {
        user.authCode = code;
        user.save().then(userSaved1 => {
          codeShomareTimeOut = setTimeout(() => {
            User.findOneAndUpdate({ _id: user._id }, { $set: { authCode: 0 } }, { new: true })
              .exec()
              .then(userSaved => {
                // befrestNotification(req.body.fcmToken, 'زمان تایید شماره به پایان رسید')
              });
          }, 100500);
          respone.user = { _id: user._id, phone: user.phone };
          return res.json(respone);
        });
      } else {
        let randomEmail = uuidV1() + "@gmail.com";
        let newUser = new User({
          phone: phone,
          email: randomEmail,
          name: "",
          familyName: "",
          authCode: code
        });
        if (req.body.fcmToken) {
          newUser.fcmToken = req.body.fcmToken;
        }
        newUser.save().then(userSavedNew => {
          codeShomareTimeOut = setTimeout(() => {
            User.findOneAndUpdate({ _id: newUser._id }, { $set: { authCode: 0 } }, { new: true })
              .exec()
              .then(userSaved => {
                // befrestNotification(req.body.fcmToken, 'زمان تایید شماره به پایان رسید')
              });
          }, 100500);
          respone.user = { _id: newUser._id, phone: newUser.phone };
          return res.json(respone);
        });
      }
    })
    .catch(err => res.status(422).send({ error: "we have a issue!", err }));
};

exports.loginWithCaptcha = (req, res) => {
  // console.log('req.body az loginWithMob', req.body)

  if (!req.body.phone) {
    return res.status(422).send({ error: "you most send your phone number!" });
  }

  let phone = Tell.phoneMobile(req.body.phone);

  if (phone === "number is not valid") {
    return res.status(422).send({ error: "your phone number is not ok!" });
  }

  User.findOne({ phone: phone })
    .exec()
    .then(async user => {
      const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
      const sms = "با سلام، کد شما در تیم چه: " + code;

      let respSms = null;

      // SendSMS.sendPattern(phone, code);

      const GRe = await chaptcha.isHuman(req.body.captcha);

      if (!GRe) {
        return res.status(422).send({ error: "your not a real human" });
      }

      if (process.env.ENVIREMENT === "production") {
        SendSMS.sendPattern(phone, code);
      }

      let codeShomareTimeOut = null;

      // codeShomareTimeOut = setTimeout(() => {
      //   befrestNotification(req.body.fcmToken, code.toString())
      // }, 900)

      let respone = {};
      if (process.env.ENVIREMENT === "development") {
        respone.code = code;
      }

      if (user) {
        user.authCode = code;
        user.save().then(userSaved1 => {
          codeShomareTimeOut = setTimeout(() => {
            User.findOneAndUpdate({ _id: user._id }, { $set: { authCode: 0 } }, { new: true })
              .exec()
              .then(userSaved => {
                // befrestNotification(req.body.fcmToken, 'زمان تایید شماره به پایان رسید')
              });
          }, 100500);
          respone.user = { _id: user._id, phone: user.phone };
          return res.json(respone);
        });
      } else {
        let randomEmail = uuidV1() + "@gmail.com";
        let newUser = new User({
          phone: phone,
          email: randomEmail,
          name: "",
          familyName: "",
          authCode: code
        });
        if (req.body.fcmToken) {
          newUser.fcmToken = req.body.fcmToken;
        }
        newUser.save().then(userSavedNew => {
          codeShomareTimeOut = setTimeout(() => {
            User.findOneAndUpdate({ _id: newUser._id }, { $set: { authCode: 0 } }, { new: true })
              .exec()
              .then(userSaved => {
                // befrestNotification(req.body.fcmToken, 'زمان تایید شماره به پایان رسید')
              });
          }, 100500);
          respone.user = { _id: newUser._id, phone: newUser.phone };
          return res.json(respone);
        });
      }
    })
    .catch(err => res.status(422).send({ error: "we have a issue!", err }));
};

exports.acceptKey = (req, res) => {
  // console.log("==================");
  // console.log("req.body from acceptKey Authentication", req.body);
  // console.log("==================");
  User.findOne({ phone: req.body.phone })
    .select("fcmToken authCode phone name familyName etOrganization asOrganization level pic")
    .exec()
    .then(userPey => {
      if (req.body.fcmToken !== userPey.fcmToken) {
        userPey.fcmToken = req.body.fcmToken;
        userPey.save().then(userSaved => {});
      }

      if (_.parseInt(req.body.code) === _.parseInt(userPey.authCode)) {
        return res.send({ token: tok(userPey), user: userPey });
      } else {
        return res.send({ peygham: "Your code is wrong" });
      }
    })
    .catch(err => res.status(422).send({ error: "we have a issue!", err }));
};

exports.getOwnUser = (req, res) => {
  if (req.user) {
    return res.send({ user: req.user });
  } else {
    return res.status(422).send({ error: "we have a issue!" });
  }
};

exports.editOwnUser = (req, res, next) => {
  // console.log('req.user az bigiKhodam', req.user);
  if (req.user) {
    req.user.name = req.body.name;
    req.user.familyName = req.body.familyName;
    req.user
      .save()
      .then(userSaved => res.send({ user: userSaved }))
      .catch(err => res.status(422).send({ error: "we have a issue!", err }));
  } else {
    return res.status(422).send({ error: "we have a issue!" });
  }
};

exports.addAddressToUser = (req, res, next) => {
  // console.log('req.user az addAddressToUser', req.user);
  // console.log('req.body az addAddressToUser', req.body);
  if (req.user) {
    let newAddress = {
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      mobilePhone: req.body.mobilePhone,
      phone: req.body.phone,
      state: req.body.state,
      town: req.body.town,
      district: req.body.district,
      text: req.body.text,
      code: req.body.code
    };
    if (req.body.lat) {
      newAddress.location = { coordinates: [req.body.lng, req.body.lat] };
    }
    req.user.address.push(newAddress);
    req.user
      .save()
      .then(userSaved => res.send({ user: userSaved }))
      .catch(err => res.status(422).send({ error: "we have a issue!", err }));
  } else {
    return res.status(422).send({ error: "we have a issue!" });
  }
};

exports.removeAddressFromUser = (req, res, next) => {
  // console.log('req.user az removeAddressFromUser', req.user);
  // console.log('req.body az removeAddressFromUser', req.body);
  if (req.user) {
    User.findOneAndUpdate({ _id: req.user._id }, { $pull: { address: { _id: req.body._id } } }, { new: true })
      .exec()
      .then(updatedUser => res.send({ user: updatedUser }))
      .catch(err => res.status(422).send({ error: "we have a issue!", err }));
  } else {
    return res.status(422).send({ error: "we have a issue!" });
  }
};
exports.removeUser = (req, res, next) => {
  if (req.user.level !== "tarah" && req.user.level !== "admin") {
    return res.status(403).send({ error: "you not have enough access right" });
  }

  User.findByIdAndRemove(req.body._id)
    .exec()
    .then(user => res.send({ user: user }))
    .catch(err => res.status(422).send({ error: "we have a issue!" }));
};

exports.login = (req, res, next) => {
  user = req.user;

  if (req.body.fcmToken) {
    user.fcmToken = req.body.fcmToken;
    user
      .save()
      .then(userSaved => res.send({ token: tok(userSaved), userSaved }))
      .catch(err => res.status(422).send({ error: "we have a issue!" }));
  } else {
    return res.send({ token: tok(req.user), user });
  }
};

exports.register = (req, res, next) => {
  // console.log('req.bodt az register Authentication', req.body);

  // let { email, password, phone, address, name, familyName, shahr, taxibs } = req.body
  let { email, password, address, name, familyName, phone } = req.body;

  // phone = pnumber.toEnglishDigits(phone.toString())

  if (!email || !password || !phone) {
    return res.status(422).send({ error: "you most have at least email password and phone" });
  }

  phone = Tell.phoneMobile(phone);

  if (phone === "number is not valid") {
    return res.status(422).send({ error: "your phone number is not ok!" });
  }

  User.findOne({ email: email })
    .exec()
    .then(userFind => {
      if (userFind) {
        return res.status(422).send({ error: "Email e has" });
      } else {
        User.findOne({ phone: phone })
          .exec()
          .then(userFindWithPhone => {
            if (userFindWithPhone) {
              return res.status(422).send({ error: "Shomare e has" });
            } else {
              let user = new User({
                email,
                password,
                address,
                name,
                familyName,
                phone
              });

              if (req.body.fcmToken) {
                user.fcmToken = req.body.fcmToken;
              }
              user.save().then(userSaved => res.json({ token: tok(userSaved), user: userSaved }));
            }
          });
      }
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));

  // User.findOne({email: email}, function (err, ur) {
  //   if (err) {
  //     return next(err)
  //   } else if (ur) {
  //     return res.status(422).send({error: 'Email e has'})
  //   }
  //   let user = new User({ email, password, address, name, familyName, phone, })

  //   if (req.body.fcmToken) {
  //     user.fcmToken = req.body.fcmToken
  //   }
  //   user.save()
  //     .then((userSaved) => {
  //       res.json({ token: tok(user), user })
  //     })
  //     .catch((err) => {
  //       return res.status(422).send({error: 'we have an issues', err})
  //     })
  // })
};

exports.users = (req, res) => {
  let query = {};
  req.query.email ? (query = { ...query, email: { $regex: req.query.email } }) : (query = query);
  req.query.familyName ? (query = { ...query, familyName: { $regex: req.query.familyName } }) : (query = query);
  req.query.phone ? (query = { ...query, $where: `/${req.query.phone}.*/.test(this.phone)` }) : (query = query);
  req.query.level ? (query = { ...query, level: { $all: req.query.level } }) : (query = query);

  User.find(query)
    .limit(30)
    .exec()
    .then(users => res.json({ users }))
    .catch(err => res.status(422).send({ error: "we have an issues" }));
};

exports.getUsersWithSearch = (req, res) => {
  // console.log('req.body az bigiKarbarhaBaSearch', req.body)

  let query = {};
  req.body.email ? (query = { ...query, email: { $regex: req.body.email } }) : (query = query);
  req.body.familyName ? (query = { ...query, familyName: { $regex: req.body.familyName } }) : (query = query);
  req.body.phone ? (query = { ...query, $where: `/${req.body.phone}.*/.test(this.phone)` }) : (query = query);
  req.body.level ? (query = { ...query, level: req.body.level }) : (query = query);

  User.find(query)
    .limit(50)
    .exec()
    .then(users => res.json({ users }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.getUsersWithLevel = (req, res) => {
  // console.log('req.query', req.query)

  User.find({ level: req.query.level })
    .exec()
    .then(users => res.json({ users }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.editUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    {
      name: req.body.name,
      familyName: req.body.familyName,
      level: req.body.level
    },
    { new: true }
  )
    .exec()
    .then(user => res.json({ user }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.editUserPass = function(req, res, next) {
  if (req.user.level !== "admin" && req.user.level !== "tarah") {
    return res.status(422).send({ error: "you'r not able to do this" });
  }
  User.findById(req.body._id)
    .exec()
    .then(userFind => {
      if (userFind) {
        userFind.password = req.body.password;
        userFind.save().then(savedUser => res.json({ user: savedUser }));
      } else {
        return res.status(422).send({ error: "can' find any user" });
      }
    })
    .catch(err => res.status(422).send({ error: "we have an truble" }));
};

exports.usersCount = async (req, res) => {
  const count = await User.find().countDocuments();
  return res.send({ UsersCount: count });
};

exports.addUser = (req, res) => {
  console.log("req.body addUser Authentication", req.body);

  let { name, familyName, email, expertise, address, password, doctor, level, phone, phoneValidate } = req.body;
  phone = Tell.phoneMobile(phone);

  if (phone === "number is not valid") {
    return res.status(422).send({ error: "your phone number is not ok!" });
  }

  User.findOne({ email: email })
    .exec()
    .then(userFind => {
      if (userFind) {
        return res.status(409).send({ error: "this email has token by another" });
      } else {
        User.findOne({ phone: phone })
          .exec()
          .then(userFindByPhone => {
            if (userFindByPhone) {
              return res.status(409).send({ error: "this phone number exist in database" });
            } else {
              let user = new User({
                name,
                familyName,
                email,
                expertise,
                address,
                password,
                doctor,
                level,
                phone,
                phoneValidate
              });
              user.save().then(userSaved => res.json({ user: userSaved }));
            }
          });
      }
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
