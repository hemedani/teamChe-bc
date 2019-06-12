const _ = require("lodash");
exports.ckeckAdmin = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLeve.ckeckAdmin ", req.user);
  // console.log("==================");

  if (_.includes(req.user.level, "tarah") || _.includes(req.user.level, "admin")) {
    return next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};

exports.checkOperatorEt = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLevel.checkAdmin ", req.user);
  // console.log("==================");
  if (
    _.includes(req.user.level, "tarah") ||
    _.includes(req.user.level, "admin") ||
    _.includes(req.user.level, "organic.bossEt") ||
    _.includes(req.user.level, "organic.operatorEt")
  ) {
    return next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};

exports.checkOfficer = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLevel.checkOfficer ", req.user);
  // console.log("==================");

  if (
    _.includes(req.user.level, "tarah") ||
    _.includes(req.user.level, "admin") ||
    _.includes(req.user.level, "organic.boss") ||
    _.includes(req.user.level, "organic.officer")
  ) {
    return next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};
