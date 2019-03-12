const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  name: {
		type: String,
		unique: true,
	},
  enName: {
		type: String,
		unique: true,
		lowercase: true
	},
	pic: String,
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  centers: [{ type: Schema.Types.ObjectId, ref: 'Center' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Option', optionSchema);

module.exports = ModelClass;
