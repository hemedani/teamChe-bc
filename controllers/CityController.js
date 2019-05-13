const mongoose = require("mongoose");
const City = require("../models/City");

exports.addCity = (req, res) => {
  const { name, enName, state, lat, lng, polygon } = req.body;
  const city = new City({
    name: name,
    enName: enName,
    state: state,
    location: { type: "Point", coordinates: [lng, lat] },
    polygon,
    creator: req.user._id
  });

  city
    .save()
    .then(citySaved => res.json({ city: citySaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.cities = (req, res) => {
  let query = {};
  if (req.query.state) {
    query.state = req.query.state;
  }

  City.find(query)
    .exec()
    .then(cities => res.json({ cities }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeCity = (req, res) => {
  console.log("req.body az removeCity :", req.body);
  City.findByIdAndRemove(req.body._id)
    .exec()
    .then(city => res.send({ msg: "removed succesfully", city }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
