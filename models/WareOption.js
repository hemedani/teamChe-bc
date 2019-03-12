const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wareOptionSchema = new Schema({
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
  wares: [{ type: Schema.Types.ObjectId, ref: 'Ware' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('WareOption', wareOptionSchema);

module.exports = ModelClass;
