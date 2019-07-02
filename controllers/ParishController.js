const mongoose = require("mongoose");
const Parish = require("../models/Parish");
const Etehadiye = require("../models/Etehadiye");
const OtaghAsnaf = require("../models/OtaghAsnaf");

exports.addParish = (req, res) => {
  // console.log("req.body az addParish ParishController", req.body);
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

exports.parishes = async (req, res) => {
  let query = {};

  const { _id, path, city, state } = req.query;
  _id ? (query._id = { $lt: mongoose.Types.ObjectId(_id) }) : (query._id = { $lt: mongoose.Types.ObjectId() });
  if (path) query.fullPath = { $regex: path };
  if (city) query.city = city;
  if (state) query.state = state;

  const getCity = async (id, org) => {
    let organization = {};
    if (org === "Et") organization = await Etehadiye.findById(id).exec();
    if (org === "As") organization = await OtaghAsnaf.findById(id).exec();
    organization.city ? (query.city = organization.city) : null;
    return query;
  };

  if (req.user.etOrganization) await getCity(req.user.etOrganization, "Et");

  if (req.user.asOrganization) await getCity(req.user.asOrganization, "As");
  Parish.find(query)
    .limit(15)
    .sort({ _id: -1 })
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
  // console.log("req.body az removeParish :", req.body);
  const { _id } = req.body;
  Parish.findOneAndDelete({ _id })
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
          // parish.polygon = parish.polygon.coordinates[0][0];
          await parish.save();
          return parish;
        })
      );
      return res.send({ parishes: updatedParishes });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
