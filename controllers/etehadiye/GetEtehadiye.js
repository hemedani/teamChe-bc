const mongoose = require("mongoose");
const Etehadiye = require("../../models/Etehadiye");

exports.etehadiyes = (req, res) => {
  let query = {};

  const { _id, path, city, state, limit = 30 } = req.query;

  _id ? (query._id = { $lt: mongoose.Types.ObjectId(_id) }) : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (path) query.fullPath = { $regex: path };
  if (city) query.city = city;
  if (state) query.state = state;

  if (req.user.asOrganization) query.otaghAsnaf = req.user.asOrganization;

  Etehadiye.find(query)
    .limit(limit)
    .sort({ _id: -1 })
    .exec()
    .then(etehadiyes => res.json({ etehadiyes }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
