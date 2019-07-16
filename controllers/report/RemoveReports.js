const Report = require("../../models/Report");

exports.removeReport = (req, res) => {
  // console.log("req.body az removeReport :", req.body);
  Report.findByIdAndRemove(req.body._id)
    .exec()
    .then(report => res.send({ msg: "removed succesfully", report }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
