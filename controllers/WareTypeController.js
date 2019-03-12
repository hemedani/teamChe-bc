const mongoose = require('mongoose');
var _ = require('lodash');
const User = require('../models/user');
const WareType = require('../models/WareType');
const Center = require('../models/Center');


exports.addWareType =  function( req, res, next ) {

  // console.log('req.body az addWareType WareTypeController', req.body);

  const wareType = new WareType({
    name: req.body.name,
    enName: req.body.enName,
    pic: req.body.pic,
    picRef: req.body.picRef,
    creator: req.user._id
  });

  wareType.save()
    .then((wareTypeSaved) => {
      return res.json({ wareType });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.wareTypes = function (req, res, next) {

  WareType.find()
    .select( 'name enName pic' )
    .exec()
    .then((wareTypes) => {
      return res.json({ wareTypes });
    })
    .catch((err) => {
      return res.status(422).send({error: 'anjam neshod'});
    })
}

exports.updateWareType = function (req, res, next) {

  // console.log('req.body az yourWareType', req.body)
  const { _id, name, enName } = req.body

  WareType.findOneAndUpdate({_id: _id}, {name: name, enName: enName})
    .exec()
    .then((wareTypeUpdated) => {
      
      // console.log('WareTypeFinded.enName ', WareTypeFinded.enName)

      let wareType = {_id: wareTypeUpdated._id, name: name, enName: enName, pic: wareTypeUpdated.pic }

      Center.find({ wareTypesRef: wareType._id })
        .exec()
        .then((centerFinded) => {
          // let centers = centerFinded._doc;
          // console.log('az to Center.find updateRaste', centers);
          if (centerFinded.length > 0) {
            
            Promise.all(
              centerFinded.map(center => {

                center.wareTypesEnName = center.wareTypesEnName.filter(en => en !== wareTypeUpdated.enName)
                center.wareTypes = center.wareTypes.filter(ct => ct.enName !== wareTypeUpdated.enName)

                center.wareTypesEnName.push(wareType.enName)
                center.wareTypes.push(wareType)
  
                return center.save()
                  .then(centerSaved => centerSaved)
              })
            )
            .then(resp => res.json({ wareType: wareType, centerLength: resp.length }))
          } else {
            return res.json({ wareType: wareType, centerLength: 0 })
          }    

        })
    })
    .catch((err) => res.status( 422 ).json( { error : 'did not saved' } ) )
}

exports.removeWareType = function (req, res, next) {
  // console.log('req.body az removeWareType :', req.body);
  WareType.findByIdAndRemove(req.body._id)
    .exec()
    .then((wareTypeRemoved) => {


      Center.find({ wareTypesRef: wareTypeRemoved._id })
      .exec()
      .then((centerFinded) => {
        // let centers = centerFinded._doc;
        // console.log('az to Center.find updateRaste', centers);
        if (centerFinded.length > 0) {
          
          Promise.all(
            centerFinded.map(center => {

              center.wareTypesEnName = center.wareTypesEnName.filter(en => en !== wareTypeRemoved.enName)
              center.wareTypes = center.wareTypes.filter(ct => ct.enName !== wareTypeRemoved.enName)
              center.wareTypesRef.remove(wareTypeRemoved._id)

              return center.save()
                .then(centerSaved => centerSaved)
            })
          )
          .then(resp => res.json({ wareType: wareTypeRemoved, centerLength: resp.length }))
        } else {
          return res.json({ wareType: wareTypeRemoved, centerLength: 0 })
        }    

      })
    })
    .catch((err) => res.status(422).send({error: 'anjam neshod'}))
}
