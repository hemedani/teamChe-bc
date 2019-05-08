const mongoose = require("mongoose");
const Parish = require("../models/Parish");

exports.addParish = (req, res) => {
  // console.log('req.body az addParish ParishController', req.body);
  const { name, enName, fullPath, state, city, lat, lng, polygon } = req.body;
  const parish = new Parish({
    name,
    enName,
    fullPath,
    state,
    city,
    location: { type: "Point", coordinates: [lng, lat] },
    polygon,
    creator: req.user._id
  });

  parish
    .save()
    .then(parishSaved => res.json({ parish: parishSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.parishes = (req, res) => {
  let query = {};

  if (req.query.path) query = { ...query, $text: { $search: req.query.path } };
  if (req.query.city) query = { ...query, city };
  if (req.query.state) query = { ...query, state };

  console.log("==================");
  console.log("query from parishes", query);
  console.log("==================");

  Parish.find(query)
    .limit(30)
    .exec()
    .then(parishes => res.json({ parishes }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.updateParish = (req, res) => {
  // console.log('req.body az updateParish', req.body)
  const { _id, name, enName, polygon, lng, lat } = req.body;

  Parish.findByIdAndUpdate(
    _id,
    {
      name,
      enName,
      location: { type: "Point", coordinates: [lng, lat] },
      polygon
    },
    { new: true }
  )
    .exec()
    .then(updatedParish => res.json({ state: updatedParish }))
    .catch(err => res.status(422).send({ error: "we have an issue", err }));
};

exports.removeParish = (req, res) => {
  // console.log('req.body az removeParish :', req.body);
  Parish.findOneAndDelete(req.body._id)
    .exec()
    .then(parish => res.send({ msg: "removed succesfully", parish }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.repairParish = (_, res) => {
  // console.log('req.body az removeParish :', req.body);
  Parish.find()
    .select("name fullPath polygon")
    .populate("city state", "name")
    .exec()
    .then(async parishes => {
      const updatedParishes = await Promise.all(
        parishes.map(async parish => {
          parish.fullPath = `${parish.state.name} - ${parish.city.name} - ${parish.name}`;
          parish.polygon = parish.polygon.coordinates[0][0];
          await parish.save();
          return parish;
        })
      );
      return res.send({ parishes: updatedParishes });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
