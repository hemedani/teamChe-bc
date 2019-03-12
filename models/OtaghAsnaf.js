const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtaghAsnafSchema = new Schema(
  {
    name: String,
    enName: String,

    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" },

    city: { type: Schema.Types.ObjectId, ref: "City" },
    state: { type: Schema.Types.ObjectId, ref: "State" },

    etehadiyeha: [{ type: Schema.Types.ObjectId, ref: "Etehadiye" }],
    rasteha: [{ type: Schema.Types.ObjectId, ref: "Raste" }],
    senfha: [{ type: Schema.Types.ObjectId, ref: "Senf" }],

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("OtaghAsnaf", OtaghAsnafSchema);

module.exports = ModelClass;
