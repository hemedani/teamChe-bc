const Report = require("../../models/Report");
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
      if (user.etOrganization) {
        if (!foundedRp.etehadiye.equals(user.etOrganization)) {
          return res.status(500).send({ msg: "مشکلی در امضاء بازرسی به وجود آمده است", err });
        }
        if (_.include(user.level, "organic.bossEt")) foundedRp.bossEtProve = true;
        if (_.include(user.level, "organic.officersEtCommission")) foundedRp.officersEtCommissionProve = true;
        if (_.include(user.level, "organic.officerEt")) {
          if (foundedRp.creator.equals(user._id)) {
            foundedRp.officerEtProve = true;
          } else {
            foundedRp.secondOfficerEtProve = true;
          }
          foundedRp.save().then(savedRp => res.send({ report: savedRp }));
        }
      } else {
        // TODO just return some err response until implement the right logic for handle asOrganization too ==================
        return res.status(500).send({ msg: "مشکلی در امضاء بازرسی به وجود آمده است", err });
      }
    })
    .catch(err => res.status(500).send({ msg: "مشکلی در امضاء بازرسی به وجود آمده است", err }));
};
