const mongoose = require('mongoose');
const _ = require('lodash');
const User = require('../models/user');
const Cart = require('../models/Cart');
const Ware = require('../models/Ware');

exports.addToCart =  ( req, res, next ) => {

  // console.log('req.body az addToCart CartController', req.body);

  Cart.findOne({ user: req.user._id })
    .exec()
    .then((cartFind) => {
      let { ware } = req.body;
      ware.totalPrice = ware.price;

      if (cartFind) {
        let isInCart = cartFind.wares.some(wareId => wareId.equals(ware._id));
        if (isInCart) {
          return res.json({ cart: cartFind })
        } else {
          cartFind.wares.push(ware._id)
          cartFind.waresArr.push(ware)
          cartFind.sumTotalPrice = (cartFind.sumTotalPrice || 0) + ware.price;

          cartFind.finalRegister = false;

          cartFind.save()
            .then((cartFindSaved) => res.json({ cart: cartFindSaved }))
        }
      } else {
        const newCart = new Cart({
          user: req.user._id,
          wares: [ware._id],
          waresArr: [ware],
          finalRegister: false
        })
        newCart.sumTotalPrice = ware.price;
        newCart.save()
          .then((newCartSaved) => res.json({ cart: newCartSaved }))
      }
    })
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.removeFromCart = ( req, res, next ) => {

  // console.log('req.body az removeFromCart CartController', req.body)
  const wId = mongoose.Types.ObjectId(req.body.wareId)

  Cart.findOne({user: req.user._id})
    .exec()
    .then((cartFinded) => {

      let wareToRemove = _.find(cartFinded.waresArr, {_id: wId})

      cartFinded.sumTotalPrice = Math.abs(cartFinded.sumTotalPrice - wareToRemove.totalPrice)
      cartFinded.wares.pull(wId)
      cartFinded.waresArr.pull({ _id: wId })

      cartFinded.finalRegister = false;

      cartFinded.save()
        .then(cartFindedSaved => res.json({ cart: cartFindedSaved }))
    })
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))

  // Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { wares: wId, waresArr: { _id: wId } }, sumTotalPrice:  })
  //   .exec()
  //   .then((cartUpdated) => res.json({ cart: cartUpdated }))
  //   .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.addAddressToCart = (req, res) => {
  Cart.findByIdAndUpdate( req.body._id, { address : req.body.address }, { new : true } )
    .exec()
    .then(cartUpdated => res.send({ cart: cartUpdated }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.finalRegister = (req, res) => {
  Cart.findByIdAndUpdate(req.body._id, { $set: { waresArr: req.body.wares, sumTotalPrice: req.body.sumTotalPrice, finalRegister: true } }, { new: true })
    .exec()
    .then(cartUpdated => res.send({ cart: cartUpdated }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.getCart = ( req, res, next ) => {

  Cart.findOne({ user: req.user._id })
    .exec()
    .then((cartFind) => res.json({ cart: cartFind }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}