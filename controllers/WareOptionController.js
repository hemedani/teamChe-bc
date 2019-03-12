const WareOption = require('../models/WareOption');
const Ware = require('../models/Ware');


exports.addWareOption =  ( req, res, next ) => {

  // console.log('req.body az WareOption WareOption', req.body);

  const wareOption = new WareOption({
    name: req.body.name,
    enName: req.body.enName,
    pic: req.body.pic,
    picRef: req.body.picRef,
    creator: req.user._id
  });

  wareOption.save()
    .then((wareOptionSaved) => res.json({ wareOption: wareOptionSaved }))
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}

exports.wareOptions =  (req, res) => {

  WareOption.find()
      .select( 'name enName pic' )
      .exec()
      .then((wareOptions) => res.json({ wareOptions }))
      .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}

exports.wareOption = (req, res, next) => {

  // console.log('req.query az WareOption', req.query)

WareOption.findById(req.query._id)
    .exec()
    .then(wareOption => res.json({ wareOption }))
    .catch(err => res.status(422).send({error: 'anjam neshod', err})) 
}


// update hanoz moshkel dare bayad bara jostjosh be option center negah konam dorosesh konam - fek konam enName ro bayad set konam jostjo be mezajha yad mood ham negah konam age onam ehtiaj dasht anjam midam

exports.updateWareOption = (req, res, next) => {

  // console.log('req.body az WareOption', req.body)
  const { _id, name, enName } = req.body

  WareOption.findOneAndUpdate({_id: _id}, {name: name, enName: enName})
    .exec()
    .then((wareOptionUpdated) => {

      let wareOption = {_id: wareOptionUpdated._id, name: name, enName: enName, pic: wareOptionUpdated.pic }

      Ware.find({ wareOptionsRef: wareOption._id })
        .exec()
        .then((wareFinded) => {
          // let wares = wareFinded._doc;
          // console.log('az to Ware.find updateWareType', wares);
          if (wareFinded.length > 0) {
            
            Promise.all(
              wareFinded.map(ware => {

                ware.wareOptionsEnName = ware.wareOptionsEnName.filter(en => en !== wareOptionUpdated.enName)
                ware.wareOptions = ware.wareOptions.filter(ct => ct.enName !== wareOptionUpdated.enName)

                ware.wareOptionsEnName.push(wareOption.enName)
                ware.wareOptions.push(wareOption)

                return ware.save()
                  .then(wareSaved => wareSaved)
              })
            )
            .then(resp => res.json({ wareOption: wareOption, wareLength: resp.length }))
          } else {
            return res.json({ wareOption: wareOption, wareLength: 0 })
          }    

        })
    })
    .catch((err) => res.status( 422 ).json( { error : 'did not saved', err } ) )
}

exports.removeWareOption = (req, res, next) => {
  // console.log('req.body az WareOption :', req.body);
  WareOption.findByIdAndRemove(req.body._id)
    .exec()
    .then((wareOption) => {

      Ware.find({ wareOptionsRef: wareOption._id })
      .exec()
      .then((wareFinded) => {
        // let wares = wareFinded._doc;
        // console.log('az to Ware.find updateWareType', wares);
        if (wareFinded.length > 0) {
          
          Promise.all(
            wareFinded.map(ware => {

              ware.wareOptionsEnName = ware.wareOptionsEnName.filter(en => en !== wareOption.enName)
              ware.wareOptions = ware.wareOptions.filter(ct => ct.enName !== wareOption.enName)
              ware.wareOptionsRef.remove(wareOption._id)

              return ware.save()
                .then(wareSaved => wareSaved)
            })
          )
          .then(resp => res.json({ wareOption: wareOption, wareLength: resp.length }))
        } else {
          return res.json({ wareOption: wareOption, wareLength: 0 })
        }    

      })
    })
    .catch((err) => res.status(422).send({error: 'anjam neshod', err}))
}
