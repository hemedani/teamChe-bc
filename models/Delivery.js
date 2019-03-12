const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  name: String,
  enName: String,
  cost: Number,
	pic: String,
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Delivery', DeliverySchema);

module.exports = ModelClass;
