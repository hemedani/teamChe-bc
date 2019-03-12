const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
  name: String,
  enName: String,
	pic: String,
	picRef: { type: Schema.Types.ObjectId, ref: 'File' },
  centers: [{ type: Schema.Types.ObjectId, ref: 'Center' }],
  wares: [{ type: Schema.Types.ObjectId, ref: 'Ware' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Label', labelSchema);

module.exports = ModelClass;
