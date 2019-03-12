const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
  link: { type: String },
	visible: { type: Boolean, default: false },
	pic: String,
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Promotion', promotionSchema);

module.exports = ModelClass;
