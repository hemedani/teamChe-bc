const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StateSchema = new Schema(
  {
    name: String,
    enName: String,
    cities: [{ type: Schema.Types.ObjectId, ref: "City" }],
    location: { type: { type: String }, coordinates: [Number] },
    polygon: { type: { type: String }, coordinates: [Array] },
    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("State", StateSchema);

module.exports = ModelClass;
