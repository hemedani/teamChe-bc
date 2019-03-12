const mongoose = require('mongoose');
var _ = require('lodash');
const Rate = require('../models/Rate');
const Center = require('../models/Center');
const Ware = require('../models/Ware');
// const { to } = require('await-to-js');

exports.rates = (req, res, next) => {

  // console.log('req.query az exports.rates RateController', req.query);

  let query = { accepted: true };
  req.query.rateId ? query._id = { $lt : mongoose.Types.ObjectId(req.query.id) } : query._id = { $lt : mongoose.Types.ObjectId() };
  query.centerRef = req.query.centerId;

  Rate.find(query)
    .limit(30)
    .sort({ _id: -1 })
    .select('user center votes qualityRate priceRate salesmanRate text reply')
    .exec()
    .then((rates) => res.json({ rates }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.wareRates = (req, res, next) => {

  // console.log('req.query az exports.rates RateController', req.query);

  let query = { accepted: true };
  req.query.rateId ? query._id = { $lt : mongoose.Types.ObjectId(req.query.id) } : query._id = { $lt : mongoose.Types.ObjectId() };
  query.wareRef = req.query.wareId;

  Rate.find(query)
    .limit(30)
    .sort({ _id: -1 })
    .select('user ware votes qualityRate priceRate salesmanRate text reply')
    .exec()
    .then((rates) => res.json({ rates }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.notAcceptedRate = (req, res, next) => {

  // console.log('req.query az exports.acceptRate RateController', req.query);

  let query = { };
  req.query.id ? query._id = { $lt : mongoose.Types.ObjectId(req.query.id) } : query._id = { $lt : mongoose.Types.ObjectId() };
  req.query.accepted ? query.accepted = req.query.accepted : query = query
  query.text = { $ne : null };

  Rate.find(query)
    .limit(30)
    .sort({ _id: -1 })
    .select('user ware center votes qualityRate priceRate salesmanRate text accepted reply')
    .exec()
    .then((rates) => res.send({ rates }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.yourRate = (req, res, next) => {

  // console.log('req.query az yourRate', req.query, req.user._id)

  Rate.findOne({center: req.query.centerId, user: req.user._id} )
    .populate('user', 'name familyName pic')
    .exec()
    .then( (rate) => res.json({ rate }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.replyRate = (req, res) => {
  // const updatedRate = await Rate.findByIdAndUpdate(req.body._id, { $set: { reply: { text: req.body.text, user: { _id: req.user._id, pic: req.user.pic, name: req.user.name, familyName: req.user.nemidonam.ali.mohsen } }, accepted: true } }, { new: true } ).exec()
  // return res.send({ rate : updatedRate })
  Rate.findByIdAndUpdate(req.body._id, { $set: { reply: { text: req.body.text, user: { _id: req.user._id, pic: req.user.pic, name: req.user.name, familyName: req.user.familyName } }, accepted: true } }, { new: true } ).exec()
    .then((updatedRate) => res.send({ rate : updatedRate }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.yourWareRate = (req, res, next) => {

  // console.log('req.query az yourWareRate', req.query, req.user._id)

  Rate.findOne({wareRef: req.query.wareId, userRef: req.user._id} )
    .exec()
    .then( (rate) => res.json({ rate }) )
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.changeWareRate = async ( req, res ) => {

  // console.log('req.body az changeWareRate', req.body)

  let findedRate = null, savedRate = null, findedWare = null, savedWare = null, err = [];
  
  findedRate = await Rate.findOne({wareRef: req.body.wareId, userRef: req.user._id} ).exec().catch(err => err.push(err))

  findedWare = await Ware.findById(req.body.wareId).exec().catch(err => err.push(err))
  
  if (findedRate) {
    if (findedRate.wareRate) {

      findedWare.wareRate.total = (findedWare.wareRate.total - findedRate.wareRate) + req.body.wareRate;
      findedWare.wareRate.average = (findedWare.wareRate.total / findedWare.wareRate.count).toFixed(1);
      findedWare.markModified(findedWare.wareRate);
      
      savedWare = await findedWare.save().catch(err => err.push(err))
    
    } else {

      findedWare.wareRate.count++;
      findedWare.wareRate.total = findedWare.wareRate.total + req.body.wareRate;
      findedWare.wareRate.average = (findedWare.wareRate.total / findedWare.wareRate.count).toFixed(1);

      findedWare.markModified(findedWare.wareRate);
      
      savedWare = await findedWare.save().catch(err => err.push(err))
      
    }

    findedRate.wareRate = req.body.wareRate;
    savedRate = await findedRate.save().catch(err => err.push(err))
  
  } else {
    
    const newRate = new Rate({
      wareRate: req.body.wareRate,
      user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
      userRef: req.user._id,
      ware: { _id: findedWare._id, title: findedWare.title, pic: findedWare.pic },
      wareRef: findedWare._id,
    })

    savedRate = await newRate.save().catch(err => err.push(err))

    findedWare.wareRate.count++;
    findedWare.wareRate.total = findedWare.wareRate.total + req.body.wareRate;
    findedWare.wareRate.average = (findedWare.wareRate.total / findedWare.wareRate.count).toFixed(1);

    findedWare.markModified(findedWare.wareRate);
      
    savedWare = await findedWare.save().catch(err => err.push(err))
  
  }

  if (err.length > 0) {
    return res.status(422).send({error: 'we have an issues', err}) 
  } else { return res.send({ rate: savedRate, ware: savedWare }) }

}

exports.addTextRateToWare = (req, res, next) => {

  // console.log('req.body az addTextRateToWare', req.body)

  Rate.findOne({wareRef: req.body.wareId, userRef: req.user._id})
    .exec()
    .then((rateFind) => {
      if (rateFind) {
        // console.log('rateFind az addTextRateToWare', rateFind)
        rateFind.text = req.body.rateText;
        rateFind.accepted = false;
        rateFind.save()
          .then((rateFindSaved) => res.json({ rate: rateFindSaved}))
      } else {
        let newRate = new Rate({ 
          user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic}, 
          wareRef: req.body.wareId, text: req.body.rateText, userRef: req.user._id })
        
        Ware.findById(req.body.wareId)
          .exec()
          .then((wareFind) => {
            wareFind.rateRef.push(newRate._id);
            newRate.ware = { _id: wareFind._id, title: wareFind.title, pic: wareFind.pic };
            wareFind.save()
              .then((wareFindSaved) => {
                newRate.save()
                  .then((newRateSaved) => res.json({ rate: newRateSaved}))
              })
          })
      }
    })
    .catch((err) => res.status(422).send({msg: 'we have an issues', err}))
}

exports.addTextRateWithCenterId = (req, res, next) => {

  let centerId = req.query.centerId || req.body.centerId || '';
  let text = req.query.text || req.body.text || '';

  Rate.findOne({centerRef: centerId, userRef: req.user._id})
    .exec()
    .then((rateFind) => {
      if (rateFind) {
        // console.log('rateFind az addTextRate', rateFind)
        rateFind.text = text;
        rateFind.accepted = false;
        rateFind.save()
          .then((rateFindSaved) => {
            Rate.findById(rateFindSaved._id)
              .then((ratePopFind) => res.json({ rate: ratePopFind}))
          })
      } else {
        
        Center.findById(centerId)
          .exec()
          .then((centerFind) => {
            if (centerFind) {

              const newRate = new Rate({
                center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
                centerRef: centerFind._id,

                user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
                userRef: req.user._id,
                text: text,
                accepted: false
              })        
              
              newRate.save()
                .then((newRateSaved) => {

                  centerFind.rateRef.push(newRateSaved._id);
                  centerFind.save()
                    .then((centerFindSaved) => {
                      let editRate =  newRateSaved._doc;
                      delete editRate.userRef;
                      delete editRate.centerRef;
                      delete editRate.accepted;
                      return res.json({ rate: editRate})
                    })
                })

            } else {
              return res.status(422).send({msg: 'center not find'})
            }
          })
        
      }
    })
    .catch( (err) => res.status(422).send({msg: 'we have an issues', err}) )

}

exports.addTextRate = (req, res, next) => {

  // console.log('req.body az addTextRate', req.body)

  Rate.findById(req.body.rateId)
    .exec()
    .then((rateFind) => {
      if (rateFind) {
        // console.log('rateFind az addTextRate', rateFind)
        rateFind.text = req.body.rateText;
        rateFind.accepted = false;
        rateFind.save()
          .then((rateFindSaved) => res.json({ rate: rateFindSaved}))
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then((centerFind) => {
            if (centerFind) {
              const newRate = new Rate({
                center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
                centerRef: centerFind._id,
                user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
                userRef: req.user._id,
                text: req.body.rateText,
                accepted: false
              })
              newRate.save()
                .then((newRateSaved) => {
                  centerFind.rateRef.push(newRateSaved._id);
                  centerFind.save()
                    .then((centerFindSaved) => res.json({ rate: centerFindSaved}))
                })

            } else {
              return res.status(422).send({msg: 'center not find'})
            }
          })

      }
    })
    .catch((err) => {
      return res.status(422).send({msg: 'we have an issues', err});
    })
}

exports.acceptRate = (req, res, next) => {
  // console.log('req.body az acceptRate :', req.body);
  
  Rate.findByIdAndUpdate(req.body.rateId, { accepted: true })
    .exec()
    .then((rate) => res.json({ rate }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.deniedRate = (req, res, next) => {
  // console.log('req.body az acceptRate :', req.body);
  
  Rate.findOneAndUpdate({_id: req.body.rateId}, { accepted: false, text: null })
    .exec()
    .then((rate) => res.json({ rate }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.justDeniedRate = (req, res, next) => {
  // console.log('req.body az acceptRate :', req.body);
  
  Rate.findOneAndUpdate({_id: req.body.rateId}, { accepted: false })
    .exec()
    .then((rate) => res.json({ rate }))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}

exports.removeRate = (req, res, next) => {
  // console.log('req.body az removeRate :', req.body);
  Rate.findByIdAndRemove(req.body.id)
    .exec()
    .then((deletedRate) => res.send({rate: deletedRate, msg: 'sucseccfuly removed rate'}))
    .catch((err) => res.status(422).send({error: 'we have an issues', err}))
}
