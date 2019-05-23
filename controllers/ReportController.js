const mongoose = require("mongoose");
const Report = require("../models/Report");

exports.addReport = (req, res) => {
  console.log("==================");
  console.log("req.body from addReport", req.body);
  console.log("==================");

  const { text, raste, etehadiye, otaghAsnaf, otaghBazargani, state, city, parish, center } = req.body;
  const report = new Report({
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

exports.reports = (req, res) => {
  let query = {};
  if (req.query.state) {
    query.state = req.query.state;
  }

  Report.find(query)
    .exec()
    .then(reports => res.json({ reports }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeReport = (req, res) => {
  // console.log("req.body az removeReport :", req.body);
  Report.findByIdAndRemove(req.body._id)
    .exec()
    .then(report => res.send({ msg: "removed succesfully", report }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
