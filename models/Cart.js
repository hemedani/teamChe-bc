const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  waresArr: [{_id: Schema.Types.ObjectId, center: Schema.Types.ObjectId, measure: String, title: String, price: Number, pic: [], amount: {
		type: Number, default: 1
	}, totalPrice: Number
	}],
  wares: [{ type: Schema.Types.ObjectId, ref: 'Ware' }],
  address: {
		_id: Schema.Types.ObjectId,
		name: String,
		mobilePhone: Number,
		phone: Number,
		state: { _id: Schema.Types.ObjectId, name: String, enName:String, deliveryType: [{ enName: String, cost: Number, name: String, pic: String }] },
		town: { name: String, enName: String },
		district: String,
		text: String,
		code: Number,
		location: { type: { type: String }, coordinates: [Number] },
	},
	sumTotalPrice: { type: Number, default: 0 },
	finalRegister: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ModelClass = mongoose.model('Cart', cartSchema);

module.exports = ModelClass;
