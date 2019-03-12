const mongoose = require('mongoose');
var _ = require('lodash');
const User = require('../models/user');
const Option = require('../models/Option');
const Center = require('../models/Center');


exports.addOption =  function( req, res, next ) {

  // console.log('req.body az addOption OptionController', req.body);

  const option = new Option({
    name: req.body.name,
    enName: req.body.enName,
    pic: req.body.pic,
    picRef: req.body.picRef,
    creator: req.user._id
  });

  option.save()
    .then((optionSaved) => {
      return res.json({ option });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.options = function (req, res, next) {

Option.find()
    .select( 'name enName pic' )
    .exec()
    .then((options) => {
      return res.json({ options });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.yourOption = function (req, res, next) {

  // console.log('req.query az yourOption', req.query)

Option.findById(req.query.optionid)
    .exec( (err, option) => {
    if (err) {
      return res.status(422).send({error: 'anjam neshod'});
    }
    // console.log('option az yourOption', option);
    return res.json({ option });
  })
}

exports.updateOption = function (req, res, next) {

  // console.log('req.body az yourOption', req.body)
  const { _id, name, enName } = req.body

  Option.findOneAndUpdate({_id: _id}, {name: name, enName: enName})
    .exec()
    .then((optionUpdated) => {

      let option = {_id: optionUpdated._id, name: name, enName: enName, pic: optionUpdated.pic }

      Center.find({ optionsRef: option._id })
        .exec()
        .then((centerFinded) => {
          // let centers = centerFinded._doc;
          // console.log('az to Center.find updateRaste', centers);
          if (centerFinded.length > 0) {
            
            Promise.all(
              centerFinded.map(center => {

                center.optionsEnName = center.optionsEnName.filter(en => en !== optionUpdated.enName)
                center.options = center.options.filter(ct => ct.enName !== optionUpdated.enName)

                center.optionsEnName.push(option.enName)
                center.options.push(option)
  
                return center.save()
                  .then(centerSaved => centerSaved)
              })
            )
            .then(resp => res.json({ option: option, centerLength: resp.length }))
          } else {
            return res.json({ option: option, centerLength: 0 })
          }    

        })
    })
    .catch((err) => res.status( 422 ).json( { error : 'did not saved' } ) )
}

exports.removeOption = function (req, res, next) {
  // console.log('req.body az removeOption :', req.body);
  Option.findByIdAndRemove(req.body._id)
    .exec()
    .then((optionRemoved) => {

      Center.find({ optionsRef: optionRemoved._id })
      .exec()
      .then((centerFinded) => {
        // let centers = centerFinded._doc;
        // console.log('az to Center.find updateRaste', centers);
        if (centerFinded.length > 0) {
          
          Promise.all(
            centerFinded.map(center => {

              center.optionsEnName = center.optionsEnName.filter(en => en !== optionRemoved.enName)
              center.options = center.options.filter(ct => ct.enName !== optionRemoved.enName)
              center.optionsRef.remove(optionRemoved._id)

              return center.save()
                .then(centerSaved => centerSaved)
            })
          )
          .then(resp => res.json({ option: optionRemoved, centerLength: resp.length }))
        } else {
          return res.json({ option: optionRemoved, centerLength: 0 })
        }    

      })
    })
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}
