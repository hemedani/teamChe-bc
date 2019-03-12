const mongoose = require('mongoose');
var _ = require('lodash');
const Ware = require('../models/Ware');
const Center = require('../models/Center');
const Rate = require('../models/Rate');

exports.addWare = (req, res) => {

  // console.log('req.body az addWare WareController', req.body);

  const { title, measure, price, preDiscount, alert, test, writing, center, code, count, packWeight, maxSales, unavailable, special, description } = req.body;

  // let wareOptions = 
  //   req.body.wareOptions || [],
  //   wareOptionsEnName = [],
  //   wareOptionsRef = [],

    let moods = req.body.moods || [],
    moodsEnName = [],
    moodsRef = [],
    picsUploaded = req.body.picsUploaded || [],
    pic = [],
    picRef = [],
    wareType = req.body.wareType;

  // wareOptions.map((wareOption) => { wareOptionsEnName.push(wareOption.enName); wareOptionsRef.push(wareOption._id) })

  moods.map((mood) => { moodsEnName.push(mood.enName); moodsRef.push(mood._id) })
  picsUploaded.map((pi) => { pic.push(pi.name); picRef.push(pi._id) })

  let ware = new Ware({
    title: title,
    measure: measure,
    price: price,
    preDiscount: preDiscount,

    alert: alert,
    test: test,
    writing: writing,

    centerRef: center,

    wareType: wareType,
    wareTypeEnName: wareType.enName,
    wareTypeRef: wareType._id,

    // wareOptions: wareOptions || [],
    // wareOptionsEnName: wareOptionsEnName || [],
    // wareOptionsRef: wareOptionsRef || [],

    moods: moods || [],
    moodsEnName: moodsEnName || [],
    moodsRef: moodsRef || [],

    pic: pic,
    picRef: picRef,

    code: code,
    count: count,
    packWeight: packWeight,
    maxSales: maxSales,
    unavailable: unavailable,

    special: special,
    description: description || [],
    creator: req.user._id
  });


  Center.findById(req.body.center)
    .exec()
    .then((centerFind) => {
      // console.log('Center.findById az addWare WareController', centerFind)
      centerFind.wares.push(ware._id)
      ware.center = {
        _id: centerFind._id,
        name: centerFind.name,
        enName: centerFind.enName,
        desctiption: centerFind.desctiption,
        address: centerFind.address
      };

      let isInWareType = centerFind.wareTypesRef.some(wareTypeId => wareTypeId.equals(wareType._id));
      if (!isInWareType) {
        centerFind.wareTypesRef.push(wareType._id);
        centerFind.wareTypesEnName.push(wareType.enName);
        centerFind.wareTypes.push({ _id: wareType._id, name: wareType.name, enName: wareType.enName, pic: wareType.pic });
        centerFind.save()
          .then((centerFindSaved) => {
            ware.save()
              .then((wareSaved) => res.json({ ware: wareSaved, center: centerFindSaved }))
          })
      } else {
        ware.save()
          .then((wareSaved) => res.json({ ware: wareSaved, center: centerFind }))
      }
    })
    .catch((err) => res.status(422).send({ error: 'we have an issues', err
    }));
}

exports.wares = (req, res) => {

  let query = {};
  req.query.centerRef && (query.centerRef = req.query.centerRef);
  req.query._id ? query._id = { $lt: mongoose.Types.ObjectId(req.query.id) } : query._id = { $lt: mongoose.Types.ObjectId() }; 
  req.query.wareType && (query.wareTypeRef = req.query.wareType);
  req.query.mood && (query.moodsEnName = req.query.mood);
  req.query.special && (req.query.special);

  let sort = {};
  req.query.sailsCount && (sort.sailsCount = 1);
  req.query.favoritesCount && (sort.favoritesCount = 1);
  (!req.query.sailsCount || !req.query.favoritCount) && ( sort._id = -1 );

  console.log('====================================');
  console.log(sort);
  console.log('====================================');

  Ware.find(query)
    .limit(9)
    .sort({ _id: -1 })
    .exec()
    .then((wares) => res.json({ wares }))
    .catch((err) => res.status(422).send({ error: 'we have an issues', err }));
}

exports.nextWare = (req, res) => {

  // console.log('req.query az nextWare WareController', req.query)

  let query = {};
  query._id = {
    $gt: req.query.id
  };
  req.query.centerId ? query.center = req.query.centerId : query = query;

  Ware.findOne(query)
    .sort({
      _id: 1
    })
    .exec()
    .then((ware) => {
      return res.json({
        ware
      });
    })
    .catch((err) => {
      return res.status(422).send({
        error: 'we have an issues',
        err
      });
    });
}

exports.previousWare = (req, res) => {

  // console.log('req.query az nextWare WareController', req.query)

  let query = {};
  query._id = {
    $lt: req.query.id
  };
  req.query.centerId ? query.center = req.query.centerId : query = query;

  Ware.findOne(query)
    .sort({ _id: -1 })
    .exec()
    .then((ware) => res.json({ ware }))
    .catch((err) => res.status(422).send({ error: 'we have an issues', err }) );
}

exports.ware = (req, res) => {

  Ware.findById(req.query.id)
    .exec()
    .then((ware) => res.json({ ware }))
    .catch((err) => res.status(422).send({ error: 'we have an issues', err }));
}

exports.centerWares = (req, res) => {

  let query = {};
  query.centerRef = req.query.centerId;
  req.query.id ? query._id = { $lt: mongoose.Types.ObjectId(req.query.id) } : query._id = { $lt: mongoose.Types.ObjectId() }; 
  Ware.find(query)
    .limit(9)
    .sort({ _id: -1 })
    .exec()
    .then((wares) => res.json({ wares }))
    .catch((err) => res.status(422).send({ error: 'we have an issues', err }));
}


exports.updateWare = ( req, res ) => {

  // console.log('req.body az addWare WareController', req.body);

  const { title, measure, price, preDiscount, alert, test, writing, center, code, count, packWeight, maxSales, unavailable, special, description } = req.body;

  // let wareOptions = 
  //   req.body.wareOptions || [],
  //   wareOptionsEnName = [],
  //   wareOptionsRef = [],

    let moods = req.body.moods || [],
    moodsEnName = [],
    moodsRef = [],
    pic = [],
    picRef = [],
    wareType = req.body.wareType;

  // wareOptions.map((wareOption) => { wareOptionsEnName.push(wareOption.enName); wareOptionsRef.push(wareOption._id) })

  moods.map((mood) => { moodsEnName.push(mood.enName); moodsRef.push(mood._id) })

  Ware.findOneAndUpdate({_id: req.body._id}, {
    title: title,
    measure: measure,
    price: price,
    preDiscount: preDiscount,

    alert: alert,
    test: test,
    writing: writing,

    centerRef: center,

    wareType: wareType,
    wareTypeEnName: wareType.enName,
    wareTypeRef: wareType._id,

    // wareOptions: wareOptions,
    // wareOptionsEnName: wareOptionsEnName,
    // wareOptionsRef: wareOptionsRef,

    moods: moods,
    moodsEnName: moodsEnName,
    moodsRef: moodsRef,

    code: code,
    count: count,
    packWeight: packWeight,
    maxSales: maxSales,
    unavailable: unavailable,

    special: special,
    description: description
  }, {new: true})
    .exec()
    .then((ware) => res.json({ ware }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}

exports.yourWare = (req, res) => {

  // console.log('req.query az yourWare', req.query)

  Ware.findById(req.query.wareId)
    .exec()
    .then((ware) => { return res.json({ ware }) })
    .catch((err) => { return res.status(422).send({ error: 'we have an issues', err }) });
}

exports.removeWare = (req, res, next) => {
  // console.log('req.body az removeWare :', req.body);
  if (req.user.level !== 'tarah' && req.user.level !== 'admin') {
    return res.status(500).send({ error: 'you not have enough access right' })
  }
  Ware.findByIdAndRemove(req.body._id)
    .exec()
    .then((wareRemoved) => res.json({ ware: wareRemoved }))
    .catch((err) => res.status(422).send({ error: 'we have an issues', err }))
}


exports.setWareRate = (req, resß) => {

  // console.log('req.body az addSalesmanRate', req.body)
  // console.log('req.user az addSalesmanRate', req.user)

  Rate.findOne({
      ware: req.body.wareId,
      user: req.user._id
    })
    .exec()
    .then((rateFind) => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.wareRate) {
          Ware.findById(req.body.wareId)
            .exec()
            .then((wareFind) => {
              // console.log('oftad to rateFind.wareRate', wareFind);
              wareFind.wareRate.total = (wareFind.wareRate.total - rateFind.wareRate) + req.body.wareRate;

              wareFind.wareRate.average = (wareFind.wareRate.total / wareFind.wareRate.count).toFixed(1);

              wareFind.markModified(wareFind.wareRate);
              rateFind.wareRate = req.body.wareRate;
              rateFind.save()
                .then((rateSaved) => {
                  wareFind.save()
                    .then((wareSaved) => res.json({ ware: wareSaved, rate: rateSaved }))
                })
            })
        } else {
          Ware.findById(req.body.wareId)
            .exec()
            .then((wareFind) => {
              if (wareFind.wareRate.total) {
                wareFind.wareRate.total = wareFind.wareRate.total + req.body.wareRate;
                wareFind.wareRate.count = wareFind.wareRate.count + 1;
              } else {
                wareFind.wareRate.total = req.body.wareRate;
                wareFind.wareRate.count = 1;
              }

              wareFind.wareRate.average = (wareFind.wareRate.total / wareFind.wareRate.count).toFixed(1);

              wareFind.markModified(wareFind.wareRate);
              rateFind.wareRate = req.body.wareRate;
              rateFind.save()
                .then((rateSaved) => {
                  wareFind.save()
                    .then((wareSaved) => {
                      return res.json({
                        ware: wareSaved,
                        rate: rateSaved
                      });
                    })
                })
            })
        }
      } else {
        Ware.findById(req.body.wareId)
          .exec()
          .then((wareFind) => {
            // console.log('oftad to Ware.findById', wareFind);
            const rate = new Rate({
              wareRate: req.body.wareRate,
              user: req.user._id,
              ware: wareFind._id,
              wareObj: {
                title: wareFind.title,
                pic: wareFind.pic
              }
            })
            rate.save()
              .then((rateSaved) => {
                // console.log('oftad to Ware.findById', wareFind);
                if (wareFind.wareRate.total) {
                  // console.log('oftad to wareFind.wareRate');
                  wareFind.wareRate.total = wareFind.wareRate.total + req.body.wareRate;
                  wareFind.wareRate.count = wareFind.wareRate.count + 1;
                } else {
                  // console.log('wareFind.wareRate nadasht ----');
                  wareFind.wareRate = {
                    total: req.body.wareRate,
                    count: 1
                  };
                }

                wareFind.wareRate.average = (wareFind.wareRate.total / wareFind.wareRate.count).toFixed(1);

                wareFind.rateRef.push(rateSaved._id);
                wareFind.markModified(wareFind.wareRate);
                wareFind.save()
                  .then((wareSaved) => {
                    return res.json({
                      ware: wareSaved,
                      rate: rateSaved
                    });
                  })
              })
          })

      }
    })
    .catch((err) => res.status(422).send({
      error: 'we have an issues',
      err
    }))

}