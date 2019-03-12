const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WareSchema = new Schema({
  title: String,
  measure: String,
  price: Number,
  preDiscount: Number,
  sailsCount: Number,
  favoritesCount: Number,
  special: { type: Boolean, default: false},
  description: [String],

  code: String,
  count: Number,
  packWeight: Number,
  maxSales: Number,
  unavailable: { type: Boolean, default: false},
  
  alert: String,
  test: String,
  writing: String,
  
  wareRate: { total: {type : Number, default: 0}, count: {type : Number, default: 0}, average: {type : Number, default: 0} },
  
  pic: [String],
  picRef: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  
  center: { _id: Schema.Types.ObjectId, name: String, enName: String, desctiption: String, address: String },
  centerRef: { type: Schema.Types.ObjectId, ref: 'Center' }, 

  wareTypeEnName: String,
  wareType: {_id: Schema.Types.ObjectId, name: String, enName: String, pic: String},
  wareTypeRef: { type: Schema.Types.ObjectId, ref: 'WareType' }, 

  // wareOptionsEnName: [String],
  // wareOptions: [{_id: Schema.Types.ObjectId, name: String, enName: String, pic: String}],
  // wareOptionsRef: [{ type: Schema.Types.ObjectId, ref: 'WareOption' }],
 
  moodsEnName: [String],
  moods: [{_id: Schema.Types.ObjectId, name: String, enName: String, pic: String}],
  moodsRef: [{ type: Schema.Types.ObjectId, ref: 'Mood' }],

  rateRef: [{ type: Schema.Types.ObjectId, ref: 'Rate' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Ware', WareSchema);

module.exports = ModelClass;
