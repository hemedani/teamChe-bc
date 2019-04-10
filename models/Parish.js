const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParishSchema = new Schema(
  {
    name: String,
    enName: String,
    state: { type: Schema.Types.ObjectId, ref: "State" },
    city: { type: Schema.Types.ObjectId, ref: "City" },
    location: { type: { type: String }, coordinates: [Number] },
    polygon: { type: { type: String }, coordinates: [Array] },
    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Parish", ParishSchema);

module.exports = ModelClass;
