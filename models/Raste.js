const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RasteSchema = new Schema(
  {
    name: String,
    enName: String,

    isic: Number,

    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Raste", RasteSchema);

module.exports = ModelClass;
