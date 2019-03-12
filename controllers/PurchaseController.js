const mongoose = require('mongoose');
const _ = require('lodash');
const uuid = require('uuid/v1')
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');
const Zarinpal = require('../service/Zarinpal');
const util = require('util')

exports.registerPurchase =  ( req, res ) => {

  // console.log('req.body az registerPurchase PurchaseController', req.body);

  const { wares, address, sumTotalPrice, delivery, description } = req.body;

  const wareIds = wares.map(ware => ware._id);

  const newPurchase = new Purchase({
    waresArr: wares,
    wares: wareIds,
    address,
    sumTotalPrice,
    delivery,
    description,
    Authority: uuid(),
    user: req.user._id
  })

  if (delivery.cost) { newPurchase.sumTotalPriceWithDelivery = sumTotalPrice + delivery.cost }

  newPurchase.save()
    .then(purchaseSaved => {
      Cart.remove({ user: req.user._id })
        .then(cartRemoved => res.send({ purchase: purchaseSaved, cart: cartRemoved}))
    })
    .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
}

exports.payPurchase = async ( req, res ) => {

  const { _id, Amount, CallbackURL, Description, Email, Mobile } = req.body;

  if (!_id) return res.status(422).send({error: 'we should have an id'})
  Zarinpal.PaymentRequest({ Amount, CallbackURL, Description, Email, Mobile })
    .then(zarin => {
      Purchase.findByIdAndUpdate(_id, {Authority: zarin.Authority}, { new: true })
        .exec()
        .then(purchaseUpdated => {
          if (!purchaseUpdated) return res.status(422).send({error: 'your purchase not find and updated'})
          return res.send({zarin, purchase: purchaseUpdated})
        })
    })
    .catch(err => res.status(422).send({error: 'we have an issue', err}))

}

exports.checkPay = (req, res) => {
  const { Authority } = req.body;
  Purchase.findOne({ Authority }).exec()
    .then(findedPurchase => {
      if (!findedPurchase || !findedPurchase.Authority) return res.status(422).send({error: 'can not find your purchase or your purchase is not suitable'})
      Zarinpal.PaymentVerification({Authority, Amount: findedPurchase.sumTotalPriceWithDelivery })
        .then(zarin => {
          if (zarin.RefID && !findedPurchase.isPaid) {
            findedPurchase.isPaid = true;
            findedPurchase.save().then(findedPurchaseSaved => findedPurchaseSaved)
          }
          return res.send({zarin, purchase: findedPurchase})
        })
    })
    .catch(err => res.status(422).send({error: 'we have an issue', err}))
}

exports.getPurchase = ( req, res ) => {
  Purchase.findById(req.query._id)
    .exec()
    .then((findedPurchase) => res.json({ purchase: findedPurchase }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.getOwnPurchases = ( req, res ) => {

  Purchase.find({ user: req.user._id })
    .exec()
    .then((findedPurchases) => res.json({ purchases: findedPurchases }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}

exports.getAllPurchases = ( req, res ) => {

  let query = {};

  Purchase.find(query)
    .limit(30)
    .sort({_id: -1})
    .exec()
    .then((findedPurchases) => res.json({ purchases: findedPurchases }))
    .catch((err) => res.status(422).send({error: 'we have an issue', err}))
}