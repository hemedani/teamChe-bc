const Center = require("../../models/Center");
const Rate = require("../../models/Rate");

const exRate = require("../../service/exRate").exRate;

exports.addQualityRate = (req, res) => {
  // console.log('req.body az addQualityRate', req.body)
  // console.log('req.user az addQualityRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.qualityRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.qualityRate', centerFind);
              centerFind.TotalQualityRate.total =
                centerFind.TotalQualityRate.total - rateFind.qualityRate + req.body.qualityRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = (
                  centerFind.TotalPeopleRate.total -
                  rateFind.qualityRate +
                  req.body.qualityRate
                ).toFixed(1);
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalQualityRate);
              rateFind.qualityRate = req.body.qualityRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalQualityRate.total) {
                centerFind.TotalQualityRate.total = centerFind.TotalQualityRate.total + req.body.qualityRate;
                centerFind.TotalQualityRate.count = centerFind.TotalQualityRate.count + 1;
              } else {
                centerFind.TotalQualityRate.total = req.body.qualityRate;
                centerFind.TotalQualityRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.qualityRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalQualityRate);
              rateFind.qualityRate = req.body.qualityRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              qualityRate: req.body.qualityRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalQualityRate.total) {
                // console.log('oftad to centerFind.TotalQualityRate');
                centerFind.TotalQualityRate.total = centerFind.TotalQualityRate.total + req.body.qualityRate;
                centerFind.TotalQualityRate.count = centerFind.TotalQualityRate.count + 1;
              } else {
                // console.log('centerFind.TotalQualityRate nadasht ----');
                centerFind.TotalQualityRate = { total: req.body.qualityRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.qualityRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.qualityRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalQualityRate.average = (
                centerFind.TotalQualityRate.total / centerFind.TotalQualityRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalQualityRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addPriceRate = (req, res) => {
  // console.log("req.body az addPriceRate", req.body);
  // console.log('req.user az addPriceRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.priceRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.priceRate', centerFind);
              centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total - rateFind.priceRate + req.body.priceRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total =
                  centerFind.TotalPeopleRate.total - rateFind.priceRate + req.body.priceRate;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalPriceRate);
              rateFind.priceRate = req.body.priceRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalPriceRate.total) {
                centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total + req.body.priceRate;
                centerFind.TotalPriceRate.count = centerFind.TotalPriceRate.count + 1;
              } else {
                centerFind.TotalPriceRate.total = req.body.priceRate;
                centerFind.TotalPriceRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.priceRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalPriceRate);
              rateFind.priceRate = req.body.priceRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              priceRate: req.body.priceRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalPriceRate.total) {
                // console.log('oftad to centerFind.TotalPriceRate');
                centerFind.TotalPriceRate.total = centerFind.TotalPriceRate.total + req.body.priceRate;
                centerFind.TotalPriceRate.count = centerFind.TotalPriceRate.count + 1;
              } else {
                // console.log('centerFind.TotalPriceRate nadasht ----');
                centerFind.TotalPriceRate = { total: req.body.priceRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.priceRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.priceRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalPriceRate.average = (
                centerFind.TotalPriceRate.total / centerFind.TotalPriceRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalPriceRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => {
      // console.log('oftad to error', err);
      return res.status(422).send({ error: "we have an issues", err });
    });
};

exports.addSalesmanRate = (req, res, next) => {
  // console.log('req.body az addSalesmanRate', req.body)
  // console.log('req.user az addSalesmanRate', req.user)

  Rate.findOne({ centerRef: req.body.centerId, userRef: req.user._id })
    .exec()
    .then(rateFind => {
      // console.log('oftad to Rate.findOne', rateFind);
      if (rateFind) {
        if (rateFind.salesmanRate) {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              // console.log('oftad to rateFind.salesmanRate', centerFind);
              centerFind.TotalSalesmanRate.total =
                centerFind.TotalSalesmanRate.total - rateFind.salesmanRate + req.body.salesmanRate;

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total =
                  centerFind.TotalPeopleRate.total - rateFind.salesmanRate + req.body.salesmanRate;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalSalesmanRate);
              rateFind.salesmanRate = req.body.salesmanRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        } else {
          Center.findById(req.body.centerId)
            .exec()
            .then(centerFind => {
              if (centerFind.TotalSalesmanRate.total) {
                centerFind.TotalSalesmanRate.total = centerFind.TotalSalesmanRate.total + req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = centerFind.TotalSalesmanRate.count + 1;
              } else {
                centerFind.TotalSalesmanRate.total = req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = 1;
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.markModified(centerFind.TotalSalesmanRate);
              rateFind.salesmanRate = req.body.salesmanRate;
              rateFind.save().then(rateSaved => {
                centerFind.save().then(centerSaved => {
                  let selectedAttrCenter = centerSaved._doc;
                  delete selectedAttrCenter.doctor;
                  return res.json({ center: selectedAttrCenter, rate: rateSaved });
                });
              });
            });
        }
      } else {
        Center.findById(req.body.centerId)
          .exec()
          .then(centerFind => {
            // console.log('oftad to Center.findById', centerFind);
            const rate = new Rate({
              salesmanRate: req.body.salesmanRate,

              center: { _id: centerFind._id, name: centerFind.name, enName: centerFind.enName, pic: centerFind.pic },
              centerRef: centerFind._id,

              user: { _id: req.user._id, name: req.user.name, familyName: req.user.familyName, pic: req.user.pic },
              userRef: req.user._id
            });
            rate.save().then(rateSaved => {
              // console.log('oftad to Center.findById', centerFind);
              if (centerFind.TotalSalesmanRate.total) {
                // console.log('oftad to centerFind.TotalSalesmanRate');
                centerFind.TotalSalesmanRate.total = centerFind.TotalSalesmanRate.total + req.body.salesmanRate;
                centerFind.TotalSalesmanRate.count = centerFind.TotalSalesmanRate.count + 1;
              } else {
                // console.log('centerFind.TotalSalesmanRate nadasht ----');
                centerFind.TotalSalesmanRate = { total: req.body.salesmanRate, count: 1 };
              }

              if (centerFind.TotalPeopleRate.total) {
                centerFind.TotalPeopleRate.total = centerFind.TotalPeopleRate.total + req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = centerFind.TotalPeopleRate.count + 1;
              } else {
                centerFind.TotalPeopleRate.total = req.body.salesmanRate;
                centerFind.TotalPeopleRate.count = 1;
              }

              centerFind.TotalSalesmanRate.average = (
                centerFind.TotalSalesmanRate.total / centerFind.TotalSalesmanRate.count
              ).toFixed(1);
              centerFind.TotalPeopleRate.average = (
                centerFind.TotalPeopleRate.total / centerFind.TotalPeopleRate.count
              ).toFixed(1);
              centerFind.markModified(centerFind.TotalPeopleRate);

              centerFind.rateRef.push(rateSaved._id);
              centerFind.markModified(centerFind.TotalSalesmanRate);
              centerFind.save().then(centerSaved => {
                let selectedAttrCenter = centerSaved._doc;
                delete selectedAttrCenter.doctor;
                return res.json({ center: selectedAttrCenter, rate: rateSaved });
              });
            });
          });
      }
    })
    .catch(err => {
      // console.log('oftad to error', err);
      return res.status(422).send({ error: "we have an issues" });
    });
};

exports.setExpertRate = (req, res, next) => {
  let rate = exRate(req.body.rate);
  Center.findByIdAndUpdate({ _id: req.body.id }, { expertRate: rate }, { new: true })
    .exec()
    .then(centerUpdated => res.json({ center: centerUpdated }))
    .catch(err => res.status(422).send({ error: "we have an issues" }));
};
