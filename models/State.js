const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StateSchema = new Schema({
  name: String,
  enName: String,
  deliveryType: [{ enName: String, cost: Number, name: String, pic: String  }],
  towns: [{name: String, enName: String, location: { type: { type: String }, coordinates: [Number] }}],
  location: { type: { type: String }, coordinates: [Number] },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('State', StateSchema);

module.exports = ModelClass;
