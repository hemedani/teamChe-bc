const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EtehadiyeSchema = new Schema(
  {
    name: String,
    enName: String,
    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" },

    city: { type: Schema.Types.ObjectId, ref: "City" },
    state: { type: Schema.Types.ObjectId, ref: "State" },

    rasteha: [{ type: Schema.Types.ObjectId, ref: "Raste" }],
    senfha: [{ type: Schema.Types.ObjectId, ref: "Senf" }],

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Etehadiye", EtehadiyeSchema);

module.exports = ModelClass;
