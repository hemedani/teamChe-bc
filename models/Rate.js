const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema({
  rate: Number,
	qualityRate: { type: Number, enum: [1, 2, 3, 4, 5] },
	wareRate: { type: Number, enum: [1, 2, 3, 4, 5] },
	priceRate: { type: Number, enum: [1, 2, 3, 4, 5] },
	salesmanRate: { type: Number, enum: [1, 2, 3, 4, 5] },
  text: String,

  votes: { plus: {type: Number, default: 0}, minus: {type: Number, default: 0}, count: {type: Number, default: 0}, result: {type: Number, default: 0} },

  accepted: {type: Boolean, default: false},
  
  center: { _id: Schema.Types.ObjectId, name: String, enName: String, pic: String},
  centerRef: { type: Schema.Types.ObjectId, ref: 'Center' },

  ware: { _id: Schema.Types.ObjectId, title: String, pic: String },
  wareRef: { type: Schema.Types.ObjectId, ref: 'Ware' },
  
  user: { _id: Schema.Types.ObjectId, name: String, familyName: String, pic: String },

  reply: { text: String, user: {_id: Schema.Types.ObjectId, name: String, familyName: String, pic: String } },
  
  userRef: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Rate', rateSchema);

module.exports = ModelClass;
