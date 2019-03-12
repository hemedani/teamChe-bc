const Delivery = require('../models/Delivery');

exports.AddDelivery =  ( req, res, next ) => {


  const delivery = new Delivery({
    name: req.body.name,
    enName: req.body.enName,
    cost: req.body.cost,
    pic: req.body.pic,
    picRef: req.body.picRef,
    creator: req.user._id
  });

  delivery.save()
    .then((deliverySaved) => res.send({ delivery: deliverySaved}))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.deliveries = (req, res, next) => {

  Delivery.find()
    .select( 'name enName cost pic' )
    .exec()
    .then((deliveries) => res.json({ deliveries }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.updateDelivery = (req, res, next) => {

  // console.log('req.body az yourDelivery', req.body)
  const { _id, name, enName, cost } = req.body

  Delivery.findOneAndUpdate({_id: _id}, { name, enName, cost }, {new: true})
    .exec()
    .then((deliveryUpdated) => res.json({ delivery: deliveryUpdated }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.removeDelivery = (req, res, next) => {
  // console.log('req.body az removeDelivery :', req.body);
  Delivery.findByIdAndRemove(req.body._id)
    .exec()
    .then((deliveryRemoved) => res.json({ delivery: deliveryRemoved }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}
