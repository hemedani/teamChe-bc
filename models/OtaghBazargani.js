const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChamberCoSchema = new Schema(
  {
    name: String,
    enName: String,

    city: { type: Schema.Types.ObjectId, ref: "City" },
    state: { type: Schema.Types.ObjectId, ref: "State" },

    otaghAsnafHa: [{ type: Schema.Types.ObjectId, ref: "OtaghAsnaf" }],
    etehadiyeha: [{ type: Schema.Types.ObjectId, ref: "Etehadiye" }],
    rasteha: [{ type: Schema.Types.ObjectId, ref: "Raste" }],
    senfha: [{ type: Schema.Types.ObjectId, ref: "Senf" }],

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("ChamberCo", ChamberCoSchema);

module.exports = ModelClass;
