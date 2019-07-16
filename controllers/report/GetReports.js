const Report = require("../../models/Report");
const _ = require("lodash");

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

  if (req.user.asOrganization) query.otaghAsnaf = req.user.asOrganization;
  if (req.user.etOrganization) query.etehadiye = req.user.etOrganization;

  if (_.includes(req.user.level, "organic.officerEt")) query.creator = req.user._id;

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
