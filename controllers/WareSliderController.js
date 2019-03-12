const WareSlider = require('../models/WareSlider');

exports.addWareSlider = ( req, res ) => {

  // console.log('req.body az addWareSlider WareSliderController', req.body);

  const { link, visible, pic, picRef } = req.body;

  const wareSlider = new WareSlider({
    link,
    visible,
    pic,
    picRef,
    creator: req.user._id
  });

  wareSlider.save()
    .then((wareSliderSaved) => res.json({ wareSlider: wareSliderSaved }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}

exports.wareSliders = (req, res) => {

  WareSlider.find({ visible: true })
    .limit(9)
    .select( 'link pic visible' )
    .exec()
    .then((wareSliders) => res.json({ wareSliders }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}));
}

exports.wareSlidersPaginate = (req, res) => {

  let Query = {}

  WareSlider.find(Query)
    .limit(30)
    .exec()
    .then((wareSliders) => res.json({ wareSliders }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}));
}

exports.yourWareSlider = (req, res) => {

  // console.log('req.query az yourWareSlider', req.query)
  WareSlider.findById(req.query.wareSliderid)
    .exec()
    .then(wareSlider => res.json({ wareSlider }))
    .catch(err => res.status(422).send({error: 'we have an issue', err}));
}

exports.updateWareSlider = (req, res) => {
  // console.log('req.body az yourWareSlider', req.body)
  const { _id, link, visible } = req.body;

  WareSlider.findOneAndUpdate({ _id }, { link, visible }, { new: true })
    .exec()
    .then(wareSliderUpdated => res.json({ wareSlider: wareSliderUpdated}))
    .catch((err) => res.status( 422 ).json( { error : 'did not saved', err } ) )
}

exports.removeWareSlider = (req, res) => {
  WareSlider.findByIdAndRemove(req.body._id)
    .exec()
    .then((wareSliderRemoved) => res.json({ wareSlider: wareSliderRemoved }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}
