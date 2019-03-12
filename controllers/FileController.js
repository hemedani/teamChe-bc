const sizeOf   =  require( 'image-size' )
const mongoose = require('mongoose');
const User = require('../models/user')
const Raste = require('../models/Raste')
const WareType = require('../models/WareType')
const Ware = require('../models/Ware')
const Center = require('../models/Center')
const Option = require('../models/Option')
const File = require('../models/File')
const Tell = require('../service/telephone')
const _ = require('lodash')
const uuidV1 = require('uuid/v1')
const fs = require('fs');
const sharp = require('sharp');

exports.upload =  ( req, res, next ) => {
  // console.log('req.user az fileController', req.user)
  // console.log('req.body az fileController', req.body)
  // console.log('req.file az fileController', req.file)

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } )
  }

  var dimensions = sizeOf( req.file.path )

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${req.file.filename}`)

  pic.save()
    .then((picSaved) => { return res.status( 200 ).send( picSaved ) })
    .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
}

exports.changeRastePic =  function( req, res, next ) {
  // console.log('req.user az fileController', req.user)
  console.log('req.body az fileController', req.body)
  // console.log('req.file az fileController', req.file)

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } )
  }

  var dimensions = sizeOf( req.file.path )

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${req.file.filename}`)

  pic.save()
    .then((picSaved) => {
      Raste.findOneAndUpdate({_id: req.body.id}, {pic: pic.name, picRef: pic._id}, {new: true})
        .exec()
        .then((rasteUpdated) => res.json({ raste: rasteUpdated })) 
    })
    .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
}

exports.changeWareTypePic =  ( req, res, next ) => {
  // console.log('req.user az fileController', req.user)
  console.log('req.body az fileController', req.body)
  // console.log('req.file az fileController', req.file)

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } )
  }

  var dimensions = sizeOf( req.file.path )

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${req.file.filename}`)

  pic.save()
    .then((picSaved) => {
      WareType.findOneAndUpdate({_id: req.body.id}, {pic: pic.name, picRef: pic._id}, {new: true})
        .exec()
        .then((wareTypeUpdated) => {
          Ware.update({ wareType: wareTypeUpdated._id }, { $set: { wareTypePic: pic.name} }, { multi: true })
            .exec()
            .then((resp) => {
              console.log('resp az Ware.update changeWareTypePic', resp)
              res.json({ wareType: wareTypeUpdated })
            })
        }) 
    })
    .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
}

// exports.changeCenterPic =  ( req, res, next ) => {
//   // console.log('req.user az fileController', req.user)
//   console.log('req.body az fileController', req.body)
//   // console.log('req.file az fileController', req.file)

//   if ( !req.file.mimetype.startsWith( 'image/' ) ) {
//     return res.status( 422 ).json( {
//       error : 'The uploaded file must be an image'
//     } )
//   }

//   var dimensions = sizeOf( req.file.path )

//   // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
//   //   return res.status( 422 ).json( {
//   //     error : 'The image must be at least 640 x 480px'
//   //   } )
//   // }

//   const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
//   sharp(`./pic/orginal/${req.file.filename}`)
//     .resize(800, 600)
//     .toFile(`./pic/800/${req.file.filename}`)
  
//   sharp(`./pic/orginal/${req.file.filename}`)
//     .resize(500, 375)
//     .toFile(`./pic/500/${req.file.filename}`)
  
//   sharp(`./pic/orginal/${req.file.filename}`)
//     .resize(240, 180)
//     .toFile(`./pic/240/${req.file.filename}`)
  
//   sharp(`./pic/orginal/${req.file.filename}`)
//     .resize(120, 120)
//     .toFile(`./pic/120/${req.file.filename}`)
  
//   sharp(`./pic/orginal/${req.file.filename}`)
//     .resize(100, 75)
//     .toFile(`./pic/100/${req.file.filename}`)

//   pic.save()
//     .then((picSaved) => {
//       Center.findOneAndUpdate({_id: req.body.id}, {pic: pic.name, picRef: pic._id}, {new: true})
//         .exec()
//         .then((CenterUpdated) => res.json({ center: CenterUpdated })) 
//     })
//     .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
// }

exports.changeUserPic =  ( req, res, next ) => {
  // console.log('req.user az fileController', req.user)
  console.log('req.body az fileController', req.body)
  // console.log('req.file az fileController', req.file)

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } )
  }

  var dimensions = sizeOf( req.file.path )

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${req.file.filename}`)

  pic.save()
    .then((picSaved) => {
      User.findOneAndUpdate({_id: req.body.id}, {pic: pic.name, picRef: pic._id}, {new: true})
        .exec()
        .then((UserUpdated) => res.json({ user: UserUpdated })) 
    })
    .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
}

exports.changeOptionPic =  ( req, res, next ) => {
  // console.log('req.user az fileController', req.user)
  console.log('req.body az fileController', req.body)
  // console.log('req.file az fileController', req.file)

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } )
  }

  var dimensions = sizeOf( req.file.path )

  // if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
  //   return res.status( 422 ).json( {
  //     error : 'The image must be at least 640 x 480px'
  //   } )
  // }

  const pic = new File({ name: req.file.filename, picType: req.file.mimetype, uploader: req.user._id })
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(800, 600)
    .toFile(`./pic/800/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(500, 375)
    .toFile(`./pic/500/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(240, 180)
    .toFile(`./pic/240/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(120, 120)
    .toFile(`./pic/120/${req.file.filename}`)
  
  sharp(`./pic/orginal/${req.file.filename}`)
    .resize(100, 75)
    .toFile(`./pic/100/${req.file.filename}`)

  pic.save()
    .then((picSaved) => {
      Option.findOneAndUpdate({_id: req.body.id}, {pic: pic.name, picRef: pic._id}, {new: true})
        .exec()
        .then((OptionUpdated) => res.json({ option: OptionUpdated })) 
    })
    .catch((err) => { return res.status( 422 ).json( { error : 'did not saved' } ) })
}

exports.testCoords = ( req, res, next ) => {
  // console.log('req.user az testCoords', req.user)
  // console.log('req.body az testCoords', req.body)

  return res.send( 'ok' )

}

exports.testReadFile = ( req, res, next ) => {

  let org = fs.readdirSync('./pic/orginal')
  let p800 = fs.readdirSync('./pic/800')
  let p500 = fs.readdirSync('./pic/500')
  let p240 = fs.readdirSync('./pic/240')
  let p120 = fs.readdirSync('./pic/120')
  let p100 = fs.readdirSync('./pic/100')

  p800.map((rm) => fs.unlinkSync(`./pic/800/${rm}`))
  p500.map((rm) => fs.unlinkSync(`./pic/500/${rm}`))
  p240.map((rm) => fs.unlinkSync(`./pic/240/${rm}`))
  p120.map((rm) => fs.unlinkSync(`./pic/120/${rm}`))
  p100.map((rm) => fs.unlinkSync(`./pic/100/${rm}`))

  Promise.all(
    org.map((og) => {
      sharp(`./pic/orginal/${og}`)
        .resize(800, 600)
        .toFile(`./pic/800/${og}`)
        .then((out) => out)
      
      sharp(`./pic/orginal/${og}`)
        .resize(500, 375)
        .toFile(`./pic/500/${og}`)
        .then((out) => out)
      
      sharp(`./pic/orginal/${og}`)
        .resize(240, 180)
        .toFile(`./pic/240/${og}`)
        .then((out) => out)
      
      sharp(`./pic/orginal/${og}`)
        .resize(120, 120)
        .toFile(`./pic/120/${og}`)
        .then((out) => out)
      
      sharp(`./pic/orginal/${og}`)
        .resize(100, 75)
        .toFile(`./pic/100/${og}`)
        .then((out) => out)
    }))
    .then((out) => res.send( { length: org.length, org } ))
    .catch((err) => console.log(err))
}
