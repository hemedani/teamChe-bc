const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RasteSchema = new Schema(
  {
    name: String,
    enName: String,
    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },
    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" },

    city: { type: Schema.Types.ObjectId, ref: "City" },
    state: { type: Schema.Types.ObjectId, ref: "State" },

    senfha: [{ type: Schema.Types.ObjectId, ref: "Senf" }],

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Raste", RasteSchema);

module.exports = ModelClass;
