const Etehadiye = require("../../models/Etehadiye");

exports.removeEtehadiye = (req, res) => {
  // console.log('req.body az removeEtehadiye :', req.body);
  Etehadiye.findOneAndDelete({ _id: req.body._id })
    .exec()
    .then(removedEtehadiye => res.json({ etehadiye: removedEtehadiye }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
