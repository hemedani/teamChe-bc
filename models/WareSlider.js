const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wareSliderSchema = new Schema({
  link: { type: String },
	visible: { type: Boolean, default: false },
	pic: String,
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('WareSlider', wareSliderSchema);

module.exports = ModelClass;
