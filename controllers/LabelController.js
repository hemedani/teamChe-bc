const mongoose = require('mongoose');
const _ = require('lodash');
const User = require('../models/user');
const Label = require('../models/Label');
const Center = require('../models/Center');


exports.addLabel =  function( req, res, next ) {

  // console.log('req.body az addLabel LabelController', req.body);

  const label = new Label({
    name: req.body.name,
    enName: req.body.enName,
    pic: req.body.pic,
    picRef: req.body.picRef,
    creator: req.user._id
  });

  label.save()
    .then((labelSaved) => {
      return res.json({ label });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.labels = function (req, res, next) {

  Label.find()
    .select( 'name enName pic' )
    .exec()
    .then((labels) => {
      return res.json({ labels });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.updateLabel = (req, res, next) => {

  // console.log('req.body az yourLabel', req.body)
  const { _id, name, enName } = req.body

  Label.findOneAndUpdate({_id: _id}, {name: name, enName: enName})
    .exec()
    .then((labelUpdated) => {

      let label = {_id: labelUpdated._id, name: name, enName: enName, pic: labelUpdated.pic }

      Center.find({ labelsRef: label._id })
        .exec()
        .then((centerFinded) => {
          // let centers = centerFinded._doc;
          // console.log('az to Center.find updateRaste', centers);
          if (centerFinded.length > 0) {
            
            Promise.all(
              centerFinded.map(center => {

                center.labelsEnName = center.labelsEnName.filter(en => en !== labelUpdated.enName)
                center.labels = center.labels.filter(ct => ct.enName !== labelUpdated.enName)

                center.labelsEnName.push(label.enName)
                center.labels.push(label)
  
                return center.save()
                  .then(centerSaved => centerSaved)
              })
            )
            .then(resp => res.json({ label: label, centerLength: resp.length }))
          } else {
            return res.json({ label: label, centerLength: 0 })
          }    

        })
    })
    .catch((err) => res.status( 422 ).json( { error : 'did not saved' } ) )
}

exports.removeLabel = function (req, res, next) {
  // console.log('req.body az removeLabel :', req.body);
  Label.findByIdAndRemove(req.body._id)
    .exec()
    .then((labelRemoved) => {

      Center.find({ labelsRef: labelRemoved._id })
      .exec()
      .then((centerFinded) => {
        // let centers = centerFinded._doc;
        // console.log('az to Center.find updateRaste', centers);
        if (centerFinded.length > 0) {
          
          Promise.all(
            centerFinded.map(center => {

              center.labelsEnName = center.labelsEnName.filter(en => en !== labelRemoved.enName)
              center.labels = center.labels.filter(ct => ct.enName !== labelRemoved.enName)
              center.labelsRef.remove(labelRemoved._id)

              return center.save()
                .then(centerSaved => centerSaved)
            })
          )
          .then(resp => res.json({ label: labelRemoved, centerLength: resp.length }))
        } else {
          return res.json({ label: labelRemoved, centerLength: 0 })
        }    

      })
    })
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}
