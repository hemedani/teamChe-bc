const State = require("../models/State");

exports.AddState = (req, res) => {
  // console.log('req.body az AddState StateController', req.body);
  const { name, enName, lat, lng, polygon } = req.body;
  let newState = new State({
    name,
    enName,
    location: { type: "Point", coordinates: [lng, lat] },
    polygon,
    creator: req.user._id
  });
  newState
    .save()
    .then(savedState => res.send({ state: savedState }))
    .catch(err => res.status(422).send({ error: "we have an issue", err }));
};

exports.states = (_, res) => {
  State.find()
    .exec()
    .then(states => res.json({ states }))
    .catch(err => res.status(422).send({ error: "we have an issue", err }));
};

exports.updateState = (req, res) => {
  // console.log('req.body az updateState', req.body)
  const { _id, name, enName, polygon, lng, lat } = req.body;

  State.findByIdAndUpdate(
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
    .then(updatedState => res.json({ state: updatedState }))
    .catch(err => res.status(422).send({ error: "we have an issue", err }));
};

exports.removeState = (req, res) => {
  State.findByIdAndRemove(req.body._id)
    .exec()
    .then(removedState => res.json({ state: removedState }))
    .catch(err => res.status(422).send({ error: "we have an issue", err }));
};
