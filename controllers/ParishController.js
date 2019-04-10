const mongoose = require("mongoose");
const Parish = require("../models/Parish");

exports.addParish = (req, res) => {
  // console.log('req.body az addParish ParishController', req.body);
  const { name, enName, state, city, lat, lng, polygon } = req.body;
  const parish = new Parish({
    name,
    enName,
    state,
    city,
    location: { type: "Point", coordinates: [lng, lat] },
    polygon: { type: "Polygon", coordinates: polygon },
    creator: req.user._id
  });

  parish
    .save()
    .then(parishSaved => res.json({ parish: parishSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.parishes = (req, res) => {
  let query = {};
  if (req.query.stateId) {
    query.state = req.query.stateId;
  }
  if (req.query.cityId) {
    query.city = req.query.cityId;
  }
  Parish.find(query)
    .exec()
    .then(parishes => res.json({ parishes }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeParish = (req, res) => {
  // console.log('req.body az removeParish :', req.body);
  Parish.findOneAndDelete(req.body._id)
    .exec()
    .then(parish => res.send({ msg: "removed succesfully", parish }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
