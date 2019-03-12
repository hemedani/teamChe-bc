const mongoose = require('mongoose');
var _ = require('lodash');
const User = require('../models/user');
const Rate = require('../models/Rate');
const Vote = require('../models/Vote');
const Center = require('../models/Center');
const Ware = require('../models/Ware');


exports.addVote =  function( req, res, next ) {

  let plus, minus;
  req.body.minus ? minus = true : minus = null;
  req.body.plus ? plus = true : plus = null;
  
  Vote.findOne({ user: req.user._id, rate: req.body.rateId })
    .exec()
    .then((voteFind) => {
      
      if (voteFind) {
        
        if ((voteFind.minus && minus) || (voteFind.plus && plus)) {
          return res.send({ massage : 'شما قبلا همین رأی را داده اید' })
        }
        
        voteFind.minus = minus;
        voteFind.plus = plus;
      
        voteFind.save()
          .then((voteFindSaved) => {
              Rate.findById(req.body.rateId)
                .exec()
                .then((rateFind) => {
                  if (minus) {
                    rateFind.votes.minus++; rateFind.votes.plus--; 
                    rateFind.votes.result = rateFind.votes.plus - rateFind.votes.minus;
                  }
                  if (plus) { 
                    rateFind.votes.plus++; rateFind.votes.minus--;
                    rateFind.votes.result = rateFind.votes.plus - rateFind.votes.minus;
                  }
                  rateFind.save()
                    .then(rateFindSaved => res.json({ rate: rateFindSaved }))
                })
          })
      } else {

        const vote = new Vote({
          plus: plus,
          minus: minus,
          user: req.user._id,
          rate: req.body.rateId,
        });
      
        vote.save()
          .then((voteSaved) => {
            Rate.findById(req.body.rateId)
            .exec()
            .then((rateFind) => {
              if (minus) {
                rateFind.votes.minus++; rateFind.votes.count++;
                rateFind.votes.result = rateFind.votes.plus - rateFind.votes.minus;
              }
              if (plus) {
                rateFind.votes.plus++; rateFind.votes.count++;
                rateFind.votes.result = rateFind.votes.plus - rateFind.votes.minus;
              }
              rateFind.save()
                .then(rateFindSaved => res.json({ rate: rateFindSaved }))
            })
          })

      }
    })
}
