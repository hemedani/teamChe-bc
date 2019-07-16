const Report = require("../../models/Report");

exports.addReport = (req, res) => {
  // console.log("==================");
  // console.log("req.body from addReport", req.body);
  // console.log("==================");

  const { subject, text, raste, etehadiye, otaghAsnaf, otaghBazargani, state, city, parish, center } = req.body;
  const report = new Report({
    subject,
    text,
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

  report
    .save()
    .then(reportSaved => res.json({ report: reportSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
