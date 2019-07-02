const mongoose = require("mongoose");
const Report = require("../models/Report");

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

exports.reports = (req, res) => {
  let query = {};
  if (req.query.center) query.center = req.query.center;
  if (req.query.raste) query.raste = req.query.raste;
  if (req.query.etehadiye) query.etehadiye = req.query.etehadiye;
  if (req.query.otaghAsnaf) query.otaghAsnaf = req.query.otaghAsnaf;
  if (req.query.otaghBazargani) query.otaghBazargani = req.query.otaghBazargani;

  if (req.query.state) query.state = req.query.state;
  if (req.query.city) query.city = req.query.city;
  if (req.query.parish) query.parish = req.query.parish;
  if (req.query.creator) query.creator = req.query.creator;

  Report.find(query)
    .exec()
    .then(reports => res.json({ reports }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.report = (req, res) => {
  const { _id } = req.query;

  Report.findById(_id)
    .populate("center raste etehadiye otaghAsnaf otaghBazargani state city parish creator")
    .exec()
    .then(report => res.json({ report }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.removeReport = (req, res) => {
  // console.log("req.body az removeReport :", req.body);
  Report.findByIdAndRemove(req.body._id)
    .exec()
    .then(report => res.send({ msg: "removed succesfully", report }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
