const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EtehadiyeSchema = new Schema(
  {
    name: String,
    enName: String,
    code: Number,
    credit: { type: Number, default: 0 },

    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" },

    city: { type: Schema.Types.ObjectId, ref: "City" },
    state: { type: Schema.Types.ObjectId, ref: "State" },
    parish: { type: Schema.Types.ObjectId, ref: "Parish" },

    rasteha: [{ type: Schema.Types.ObjectId, ref: "Raste" }],
    senfha: [{ type: Schema.Types.ObjectId, ref: "Senf" }],

    address: { state: String, city: String, parish: String, text: String },
    location: { type: { type: String }, coordinates: [Number] },

    pic: String,
    picRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" },
    officers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Etehadiye", EtehadiyeSchema);

module.exports = ModelClass;
