const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RasteSchema = new Schema(
  {
    name: String,
    enName: String,

    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Raste", RasteSchema);

module.exports = ModelClass;
