const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  minus: Boolean,
  plus: Boolean,
  
  rate: { type: Schema.Types.ObjectId, ref: 'Rate' },
  
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Vote', VoteSchema);

module.exports = ModelClass;
