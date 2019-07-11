const User = require("../../models/user");
const Etehadiye = require("../../models/Etehadiye");

exports.addEtehadiye = (req, res) => {
  // console.log("req.body az addEtehadiye EtehadiyeController", req.body);

  if (req.user.asOrganization) {
    if (!req.user.asOrganization.equals(req.user.asOrganization)) {
      return res.status(422).send({ error: "you can not do this" });
    }
  }

  let {
    name,
    enName,
    code,
    otaghAsnaf,
    otaghBazargani,
    city,
    state,
    parish,
    address,
    text,
    pic,
    picRef,
    lat,
    lng
  } = req.body;
  address.text = text;
  const etehadiye = new Etehadiye({
    name,
    enName,
    code,

    otaghAsnaf,
    otaghBazargani,

    city,
    state,
    parish,

    address,
    location: { type: "Point", coordinates: [lng, lat] },

    pic,
    picRef,
    creator: req.user._id
  });

  etehadiye
    .save()
    .then(etehadiyeSaved => res.json({ etehadiye: etehadiyeSaved }))
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.addOfficerToEtehadiye = (req, res) => {
  const { _id, users } = req.body;
  const usersId = users.map(user => user._id);

  Etehadiye.findById(_id)
    .exec()
    .then(async findedEt => {
      const availableUser = await User.find({ _id: { $in: usersId } });

      const sortedAvailableUserByEt = availableUser.reduce((pValue, cValue) => {
        if (cValue.etOrganization) {
          pValue[cValue.etOrganization] = pValue[cValue.etOrganization] || [];
          pValue[cValue.etOrganization].push(cValue._id);
        }
        return pValue;
      }, {});

      let promises = [];

      for (let key in sortedAvailableUserByEt) {
        const promise = Etehadiye.findOneAndUpdate(
          { _id: key },
          { $pullAll: { officers: sortedAvailableUserByEt[key] } },
          { new: true }
        );
        promises.push(promise);
      }

      const clearEts = await Promise.all(promises);

      await Promise.all(
        findedEt.officers.map(ofId => User.findOneAndUpdate({ _id: ofId }, { etOrganization: null }, { new: true }))
      );

      await Promise.all(usersId.map(ofId => User.findOneAndUpdate({ _id: ofId }, { etOrganization: null }, { new: true })));

      const updatedEt = await Etehadiye.findOneAndUpdate({ _id }, { officers: usersId }, { new: true });

      const updatedUsers = await Promise.all(
        usersId.map(userId => User.findOneAndUpdate({ _id: userId }, { etOrganization: _id }, { new: true }))
      );

      return res.json({ etehadiye: updatedEt, users: updatedUsers, updatedEts: clearEts });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
