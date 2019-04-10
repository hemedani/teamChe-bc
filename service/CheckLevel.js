const _ = require("lodash");
exports.ckeckAdmin = (req, res, next) => {
  // console.log("==================");
  // console.log("req.user CheckLeve.ckeckAdmin ", req.user);
  // console.log("==================");

  if (_.includes(req.user.level, "tarah") || _.includes(req.user.level, "admin")) {
    next();
  } else {
    return res.status(500).send({ error: "you not have enough access right" });
  }
};
