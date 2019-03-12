const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sheklWareType = new Schema({
  name: String,
  enName: String,
  pic: String,
  
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  centers: [{ type: Schema.Types.ObjectId, ref: 'Center' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('WareType', sheklWareType);

module.exports = ModelClass;
