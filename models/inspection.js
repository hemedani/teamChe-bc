const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionSchema = new Schema(
  {
    detail: String,
    seenBy: [{ _id: Schema.Types.ObjectId, name: String, count: Number }],
    center: { type: Schema.Types.ObjectId, ref: "Center" },
    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Inspection", inspectionSchema);

module.exports = ModelClass;
