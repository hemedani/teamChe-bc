const Report = require("../../models/Report");
const Center = require("../../models/Center");
const Etehadiye = require("../../models/Etehadiye");
const SendSMS = require("../../service/SendSMS");

exports.addReport = (req, res) => {
  // console.log("==================");
  // console.log("req.body from addReport", req.body);
  // console.log("==================");

  const {
    text,
    subject,
    numberOfEmployee,
    isOwnerPresent,
    clause,
    fileNumber,
    raste,
    etehadiye,
    otaghAsnaf,
    otaghBazargani,
    state,
    city,
    parish,
    center
  } = req.body;
  let report = new Report({
    text,
    subject,
    numberOfEmployee,
    isOwnerPresent,
    clause,
    fileNumber,
    raste,
    etehadiye,
    otaghAsnaf,
    otaghBazargani,
    state,
    city,
    parish,
    center,
    creator: req.user._id
  });

  if (_.includes(req.user.level, "organic.officerEt")) {
    report.officerEtProve = true;
  }

  if (process.env.ENVIREMENT === "production") {
    Center.findById(center)
      .exec()
      .then(async foundedCenter => {
        if (foundedCenter.guildOwnerPhoneNumber) {
          const foundedEt = await Etehadiye.findById(etehadiye);

          SendSMS.sendCustomMsg(
            [foundedCenter.guildOwnerPhoneNumber],
            `یک اخطار با موضوع ${subject} در اتحادیه ${foundedEt.name} برای شما ثبت شده است`
          );
        }
      });
  }

  report
    .save()
    .then(reportSaved => res.json({ report: reportSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
