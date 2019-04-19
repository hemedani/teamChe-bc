const mongoose = require("mongoose");
const _ = require("lodash");
const User = require("../models/user");
const Inspection = require("../models/Inspection");
const Center = require("../models/Center");

exports.addInspection = (req, res) => {
  // console.log('req.body az addInspection InspectionController', req.body);

  const inspection = new Inspection({
    detail: req.body.detail,
    center: req.body.center,
    creator: req.user._id
  });

  inspection
    .save()
    .then(inspectionSaved => res.json({ inspection: inspectionSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.inspections = (_, res) => {
  Inspection.find()
    .exec()
    .then(inspections => res.json({ inspections }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.inspection = (req, res) => {
  // console.log('req.query az inspection', req.query)

  Inspection.findById(req.query._id)
    .exec()
    .then(inspection => {
      console.log("==================");
      console.log("inspection before seened", inspection);
      console.log("==================");

      const seenedBefore = _.find(inspection.seenBy, req.user._id, "_id");
      if (seenedBefore) {
        seenedBefore.count = ++seenedBefore.count;
      } else {
        inspection.seenBy.push({ _id: req.user._id, name: req.user.name, count: 1 });
      }
      console.log("==================");
      console.log("inspection after seend", inspection);
      console.log("==================");

      inspection.save().then(savedInpection => res.send({ inspection: savedInpection }));
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.updateInspection = (req, res) => {
  // console.log('req.body az yourInspection', req.body)
  const { _id, name, enName } = req.body;

  Inspection.findOneAndUpdate({ _id: _id }, { name: name, enName: enName })
    .exec()
    .then(inspectionUpdated => {
      let inspection = { _id: inspectionUpdated._id, name: name, enName: enName, pic: inspectionUpdated.pic };

      Center.find({ inspectionsRef: inspection._id })
        .exec()
        .then(centerFinded => {
          // let centers = centerFinded._doc;
          // console.log('az to Center.find updateRaste', centers);
          if (centerFinded.length > 0) {
            Promise.all(
              centerFinded.map(center => {
                center.inspectionsEnName = center.inspectionsEnName.filter(en => en !== inspectionUpdated.enName);
                center.inspections = center.inspections.filter(ct => ct.enName !== inspectionUpdated.enName);

                center.inspectionsEnName.push(inspection.enName);
                center.inspections.push(inspection);

                return center.save().then(centerSaved => centerSaved);
              })
            ).then(resp => res.json({ inspection: inspection, centerLength: resp.length }));
          } else {
            return res.json({ inspection: inspection, centerLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).json({ error: "did not saved" }));
};

exports.removeInspection = (req, res) => {
  // console.log('req.body az removeInspection :', req.body);
  Inspection.findByIdAndRemove(req.body._id)
    .exec()
    .then(inspectionRemoved => {
      Center.find({ inspectionsRef: inspectionRemoved._id })
        .exec()
        .then(centerFinded => {
          // let centers = centerFinded._doc;
          // console.log('az to Center.find updateRaste', centers);
          if (centerFinded.length > 0) {
            Promise.all(
              centerFinded.map(center => {
                center.inspectionsEnName = center.inspectionsEnName.filter(en => en !== inspectionRemoved.enName);
                center.inspections = center.inspections.filter(ct => ct.enName !== inspectionRemoved.enName);
                center.inspectionsRef.remove(inspectionRemoved._id);

                return center.save().then(centerSaved => centerSaved);
              })
            ).then(resp => res.json({ inspection: inspectionRemoved, centerLength: resp.length }));
          } else {
            return res.json({ inspection: inspectionRemoved, centerLength: 0 });
          }
        });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
