const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    subject: String,
    text: String,
    fileNumber: Number,

    clause: { type: Number, enum: [23, 26, 27, 28] },
    isOwnerPresent: Boolean,
    numberOfEmployee: Number,

    bossEtProve: { type: Boolean, default: false },
    officersEtCommissionProve: { type: Boolean, default: false },
    officerEtProve: { type: Boolean, default: false },
    secondOfficerEtProve: { type: Boolean, default: false },

    center: { type: Schema.Types.ObjectId, ref: "Center" },
    raste: { type: Schema.Types.ObjectId, ref: "Raste" },
    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },
    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" },

    state: { type: Schema.Types.ObjectId, ref: "State" },
    city: { type: Schema.Types.ObjectId, ref: "City" },
    parish: { type: Schema.Types.ObjectId, ref: "Parish" },

    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Report", ReportSchema);

module.exports = ModelClass;
