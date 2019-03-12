const mongoose = require('mongoose')
const _ = require('lodash')
const User = require('../models/user')
const jwt = require('jwt-simple')
const Massage = require('../models/Massage')
const Center = require('../models/Center')

const config = require('../config')

exports.addMassage =  ( req, res, next ) => {

  console.log('req.body req.headers az addMassage MassageController', req.body, req.headers)

  const massage = new Massage({ text: req.body.text })

  if (req.headers.sabti && req.headers.sabti !== 'null') {
    let decode = jwt.decode(req.headers.sabti, config.secret)
    User.findById(decode.sub)
      .exec()
      .then((userFind) => {
        massage.user = {name: `${userFind.name} ${userFind.familyName}`, email: userFind.email, phone: userFind.phone}
        massage.userRef = userFind._id
        massage.save()
          .then((massageSaved) => res.json({ massage }))
          .catch((err) => res.status(422).send({error: 'anjam neshod'}))
      })
  } else {
    massage.user = {name: req.body.name, email: req.body.email, phone: req.body.phone}
    massage.save()
      .then((massageSaved) => res.json({ massage }))
      .catch((err) => res.status(422).send({error: 'anjam neshod'}))
  }
}

exports.massages = function (req, res, next) {

  let query = { isRead: false }
  req.query.readed ? query.isRead = true : query = query;
  req.query.answered ? query.isAnswered = true : query = query;

  Massage.find(query)
    .select( 'user text isRead isAnswered' )
    .exec()
    .then((massages) => {
      console.log(massages)
      res.json({ massages })})
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}

exports.readMassage = function (req, res, next) {

  console.log('req.body az readMassage', req.body)
  Massage.findOneAndUpdate({_id: req.body._id}, { isRead: true }, {new: true})
    .exec()
    .then(isReadedMsg => {
      console.log(isReadedMsg)
      return res.json({ massage: isReadedMsg })
    })
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}


exports.removeMassage = function (req, res, next) {
  // console.log('req.body az removeMassage :', req.body);
  Massage.findByIdAndRemove(req.body.id)
    .exec()
    .then((err) => {
      return res.send('ba movafghiyat hazf shod');
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}
