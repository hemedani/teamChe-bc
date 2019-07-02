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

exports.checkOrg = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLeve.ckeckAdmin ", req.user);
  // console.log("==================");

  if (
    _.includes(req.user.level, "tarah") ||
    _.includes(req.user.level, "admin") ||
    _.includes(req.user.level, "organic.operatorEt") ||
    _.includes(req.user.level, "organic.bossEt") ||
    _.includes(req.user.level, "organic.officerEt") ||
    _.includes(req.user.level, "organic.bossAs") ||
    _.includes(req.user.level, "organic.operatorAs") ||
    _.includes(req.user.level, "organic.officerAs") ||
    _.includes(req.user.level, "organic.officer")
  ) {
    return next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};

exports.checkAsOrg = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLeve.ckeckAdmin ", req.user);
  // console.log("==================");

  if (
    _.includes(req.user.level, "tarah") ||
    _.includes(req.user.level, "admin") ||
    _.includes(req.user.level, "organic.bossAs") ||
    _.includes(req.user.level, "organic.operatorAs") ||
    _.includes(req.user.level, "organic.officerAs")
  ) {
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
  // "organic.operatorEt",
  // "organic.bossEt",
  // "organic.officerEt",

  // "organic.operatorAs",
  // "organic.bossAs",
  // "organic.officerAs"
  if (
    _.includes(req.user.level, "tarah") ||
    _.includes(req.user.level, "admin") ||
    _.includes(req.user.level, "organic.operatorEt") ||
    _.includes(req.user.level, "organic.bossEt") ||
    _.includes(req.user.level, "organic.officerEt") ||
    _.includes(req.user.level, "organic.bossAs") ||
    _.includes(req.user.level, "organic.operatorAs") ||
    _.includes(req.user.level, "organic.officerAs") ||
    _.includes(req.user.level, "organic.officer")
  ) {
    return next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};
