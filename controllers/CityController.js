const mongoose = require('mongoose');
var _ = require('lodash');
const City = require('../models/City');

exports.addCity = ( req, res, next ) => {

  // console.log('req.body az addCity CityController', req.body);

  const city = new City({
    name: req.body.name,
    enName: req.body.enName,
    location: { type: 'Point', coordinates: [req.body.lng, req.body.lat] },
    latD: req.body.latD,
    lngD: req.body.lngD,
    creator: req.user._id,
    polygon: { type: 'Polygon', coordinates: req.body.polygon }
  });

  city.save()
    .then((citySaved) => res.json({ city }))
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}

exports.cities = (req, res, next) => {

  City.find()
    .exec()
    .then((cities) => {
      return res.json({ cities });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.yourCity = (req, res, next) => {

  // console.log('req.query az yourCity', req.query)

  City.findById(req.query.cityid)
    .exec( (err, city) => {
    if (err) {
      return res.status(422).send({error: 'anjam neshod'});
    }
    // console.log('city az yourCity', city);
    return res.json({ city });
  })
}

exports.removeCity = (req, res, next) => {
  // console.log('req.body az removeCity :', req.body);
  City.findByIdAndRemove(req.body.id)
    .exec()
    .then((err) => {
      return res.send('ba movafghiyat hazf shod');
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}
