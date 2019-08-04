const Report = require("../../models/Report");
const Center = require("../../models/Center");
const Etehadiye = require("../../models/Etehadiye");
const SendSMS = require("../../service/SendSMS");
const _ = require("lodash");

exports.updateReport = (req, res) => {
  // console.log("==================");
  // console.log("req.body from addReport", req.body);
  // console.log("==================");
  const { _id, text, subject, numberOfEmployee, isOwnerPresent, clause, fileNumber } = req.body;
  let updateObj = {};
  if (text) updateObj.text = text;
  if (subject) updateObj.subject = subject;
  if (numberOfEmployee) updateObj.numberOfEmployee = numberOfEmployee;
  if (isOwnerPresent) updateObj.isOwnerPresent = isOwnerPresent;
  if (clause) updateObj.clause = clause;
  if (fileNumber) updateObj.fileNumber = fileNumber;

  Report.findOneAndUpdate({ _id }, updateObj, { new: true })
    .exec()
    .then(updateReport => res.send({ report: updateReport }))
    .catch(err => res.status(500).send({ msg: "مشکلی در بروزرسانی به وجود آمده است", err }));
};

exports.setProveForReport = (req, res) => {
  const { user } = req;
  const { _id } = req.body;

  Report.findOne({ _id })
    .exec()
    .then(foundedRp => {
      if (user.level.include("organic.bossEt")) foundedRp.bossEtProve = true;
      if (user.level.include("organic.officersEtCommission")) foundedRp.officersEtCommissionProve = true;
      if (user.level.include("organic.officerEt")) {
        if (foundedRp.creator === user._id) {
          foundedRp.officerEtProve = true;
        } else {
          foundedRp.secondOfficerEtProve = true;
        }
        foundedRp.save().then(savedRp => res.send({ report: savedRp }));
      }
    })
    .catch(err => res.status(500).send({ msg: "مشکلی در امضاء بازرسی به وجود آمده است", err }));
};
