const mongoose = require("mongoose");
const _ = require("lodash");
const User = require("../../models/user");
const Center = require("../../models/Center");
const City = require("../../models/City");

const download = require("image-downloader");
const uuidv4 = require("uuid/v4");

exports.fixOfficeDoctors = (req, res, next) => {
  // console.log(req.body)
  Center.find()
    .exec()
    .then(centersFind => {
      Promise.all(
        centersFind.map(center => {
          // if (center.officeDoctorsRef.length > 0) {

          return Promise.all(
            center.officeDoctorsRef.map(EachOfDr => {
              return User.findById(EachOfDr)
                .exec()
                .then(EachOfDrFind => {
                  // let hasId = center.rastesRef.some(rasteRef => rasteRef.equals(rasteFind._id));
                  // if (!hasId) center.rastesRef.push(rasteFind._id)
                  return EachOfDrFind;
                });
            })
          ).then(resp => {
            // console.log('resp from fixOfficDocters EachOfDrFind.then ', resp)
            // let ofdrs = resp.map(ofdr => ({ pic: ofdr.pic, name: ofdr.name, familyName: ofdr.familyName, _id: ofdr._id}))
            center.officeDoctors = resp.map(ofdr => ({
              pic: ofdr.pic,
              name: ofdr.name,
              familyName: ofdr.familyName,
              _id: ofdr._id
            }));
            return center.save().then(centerSaved => {
              return centerSaved;
            });
          });

          // }
        })
      ).then(resp => {
        return res.json(resp.length);
      });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.fixedStaticMaps = async (req, res) => {
  let limit = _.parseInt(req.query.limit) || 30;
  let page = Math.ceil(_.parseInt(req.query.page - 1)) || 0;
  if (page < 0) page = 0;

  const centers = await Center.find()
    .skip(limit * page)
    .limit(limit)
    .exec()
    .catch(err => res.status(422).send({ error: "we have an issues", err }));

  const cnmap = await Promise.all(
    centers.map(async center => {
      const staticMapImgName = `${uuidv4()}.png`;

      const mapOptions = {
        url: `https://maps.googleapis.com/maps/api/staticmap?language=fa&center=${center.location.coordinates[1]},${
          center.location.coordinates[0]
        }&zoom=16&size=640x400&maptype=roadmap&markers=icon:https://pinteb.ir/static/img/pin.png%7C${
          center.location.coordinates[1]
        },${center.location.coordinates[0]}&key=AIzaSyCPfDQXNU5sl3Ar7gfy-CSbWijyHJ2mjrY`,
        dest: `./pic/maps/${staticMapImgName}`
      };
      const downloadedMap = await download
        .image(mapOptions)
        .catch(err => res.status(422).send({ error: "we have an issues", err }));
      center.staticMap = staticMapImgName;
      const savedCenter = await center.save();

      return savedCenter;
    })
  );

  return res.json({ length: cnmap.length, centers: cnmap });
};

exports.fixOtherAddressId = (_, res) => {
  // console.log(req.body)

  Center.find()
    .exec()
    .then(async centersFind => {
      let centerWithOtherAddress = [];
      centersFind.map(center => {
        if (center.otherAdresses.length > 0) {
          centerWithOtherAddress.push(center);
        }
      });
      const centerFixed = await Promise.all(
        centerWithOtherAddress.map(centerWOAmap => {
          centerWOAmap.otherAdresses.map(EachOtherAdd => {
            EachOtherAdd._id = mongoose.Types.ObjectId();
          });
          return centerWOAmap.save().then(centerWOAmapSaved => centerWOAmapSaved);
        })
      );
      return res.send({ centerFixed, centerFixedLength: centerFixed.length });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.fixCenterFullPath = (_, res) => {
  Center.find()
    .exec()
    .then(async centersFind => {
      const centerFixed = await Promise.all(
        centersFind.map(centerWOAmap => {
          centerWOAmap.fullPath = `${centerWOAmap.name}, ${centerWOAmap.address.state} - ${centerWOAmap.address.city} - ${
            centerWOAmap.address.parish
          } - ${centerWOAmap.address.text}`;
          return centerWOAmap.save().then(centerWOAmapSaved => centerWOAmapSaved);
        })
      );
      return res.send({ centerFixed, centerFixedLength: centerFixed.length });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.fixOtaghBazargani = (_, res) => {
  Center.find()
    .exec()
    .then(async fundedCenters => {
      const fixedCenters = await Promise.all(
        fundedCenters.map(eachCenter => {
          eachCenter.otaghBazargani = "5cff9a5a321a524904eb8fba";
          return eachCenter.save().then(eachCenterSaved => eachCenterSaved);
        })
      );
      return res.send({ fixedCentersLength: fixedCenters.length, fixedCenters });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.fixOtaghAsnafForCenter = (_, res) => {
  Center.find()
    .exec()
    .then(async fundedCenters => {
      const fixedCenters = await Promise.all(
        fundedCenters.map(eachCenter => {
          eachCenter.otaghAsnaf = "5d1b7842c6ef1e1723c64e1d";
          return eachCenter.save().then(eachCenterSaved => eachCenterSaved);
        })
      );
      return res.send({ fixedCentersLength: fixedCenters.length, fixedCenters });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};

exports.fixCity = (_, res) => {
  City.findOne({ enName: "Tehran" })
    .exec()
    .then(cityFind => {
      if (cityFind) {
        Center.update(
          { cityName: "Tehran" },
          { $set: { city: { location: cityFind.location, enName: "Tehran", name: "تهران" } }, cityRef: cityFind._id },
          { multi: true }
        )
          .exec()
          .then(resp => {
            console.log("az to Center.update", resp);
            return res.json({ resp });
          });
      }
    });
};

exports.fixGuildStatus = (_, res) => {
  Center.find()
    .exec()
    .then(async fundedCenters => {
      const fixedCenters = await Promise.all(
        fundedCenters.map(eachCenter => {
          eachCenter.guildStatus = "receiveLicense";
          return eachCenter.save().then(eachCenterSaved => eachCenterSaved);
        })
      );
      return res.send({ fixedCentersLength: fixedCenters.length, fixedCenters });
    })
    .catch(err => res.status(422).send({ error: "we have an issues", err }));
};
