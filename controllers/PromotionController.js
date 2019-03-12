const Promotion = require('../models/Promotion');

exports.addPromotion = ( req, res ) => {

  // console.log('req.body az addPromotion PromotionController', req.body);

  const { link, visible, pic, picRef } = req.body;

  const promotion = new Promotion({
    link,
    visible,
    pic,
    picRef,
    creator: req.user._id
  });

  promotion.save()
    .then((promotionSaved) => res.json({ promotion: promotionSaved }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}

exports.promotions = (req, res) => {

  Promotion.find({ visible: true })
    .limit(4)
    .select( 'link pic' )
    .exec()
    .then((promotions) => res.json({ promotions }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}));
}

exports.promotionsPaginate = (req, res) => {

  let Query = {}

  Promotion.find(Query)
    .limit(30)
    .exec()
    .then((promotions) => res.json({ promotions }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}));
}

exports.yourPromotion = (req, res) => {

  // console.log('req.query az yourPromotion', req.query)
  Promotion.findById(req.query.promotionid)
    .exec()
    .then(promotion => res.json({ promotion }))
    .catch(err => res.status(422).send({error: 'we have an issue', err}));
}

exports.updatePromotion = (req, res) => {
  // console.log('req.body az yourPromotion', req.body)
  const { _id, link, visible } = req.body;

  Promotion.findOneAndUpdate({ _id }, { link, visible }, { new: true })
    .exec()
    .then(promotionUpdated => res.json({ promotion: promotionUpdated}))
    .catch((err) => res.status( 422 ).json( { error : 'did not saved', err } ) )
}

exports.removePromotion = (req, res) => {
  Promotion.findByIdAndRemove(req.body._id)
    .exec()
    .then((promotionRemoved) => res.json({ promotion: promotionRemoved }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}
