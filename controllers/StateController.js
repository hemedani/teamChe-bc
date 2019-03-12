const State = require('../models/State');

exports.AddState =  ( req, res, next ) => {

  // console.log('req.body az AddState StateController', req.body);

  let newState = new State({
    name: req.body.name,
    enName: req.body.enName,
    deliveryType: req.body.deliveryType,
    creator: req.user._id
  });

  if (req.body.lat) { newState.location = { type: 'Point', coordinates: [req.body.lng, req.body.lat] } }

  newState.save()
    .then((savedState) => res.send({ state: savedState}))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.addTownToState = (req, res) => {
  let newTown = { name: req.body.name, enName: req.body.enName };
  if (req.body.lat) { newTown.location = { type: 'Point', coordinates: [req.body.lng, req.body.lat] } }

  State.findOneAndUpdate( { _id: req.body._id }, { $push : { towns: newTown } }, { new: true } )
    .exec()
    .then( ( updatedState ) => res.json({ state: updatedState }))
    .catch( ( err ) => res.status(422).send( { error: 'we have an issue', err } ) )
}

exports.states = (req, res, next) => {

  State.find()
    .select( 'name enName deliveryType towns' )
    .exec()
    .then((states) => res.json({ states }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.updateState = (req, res, next) => {

  // console.log('req.body az updateState', req.body)
  const { _id, name, enName, deliveryType } = req.body

  State.findByIdAndUpdate(_id, { name, enName, deliveryType }, {new: true})
    .exec()
    .then((updatedState) => res.json({ state: updatedState }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.removeState = (req, res, next) => {
  State.findByIdAndRemove(req.body._id)
    .exec()
    .then((removedState) => res.json({ state: removedState }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}
