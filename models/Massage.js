const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MassageSchema = new Schema({
  text: String,
	user: {name: String, email: String, phone: Number},
	isRead: {type:Boolean, default: false},
  isAnswered: {type:Boolean, default: false},
  userRef: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Massage', MassageSchema);

module.exports = ModelClass;
