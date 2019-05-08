const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CenterSchema = new Schema(
  {
    name: String,
    enName: String,
    description: String,

    telegram: String,
    instagram: String,
    email: String,
    website: String,
    workShift: [Number],
    expertRate: { type: Number, enum: [1, 2, 3, 4, 5] },
    likes: Number,
    phone: [Number],
    discount: { type: Number, min: 0, max: 100, default: 0 },

    TotalQualityRate: { total: Number, count: Number, average: Number },
    TotalPeopleRate: { total: Number, count: Number, average: Number },
    TotalPriceRate: { total: Number, count: Number, average: Number },
    TotalSalesmanRate: { total: Number, count: Number, average: Number },

    wareTypes: [{ type: Schema.Types.ObjectId, ref: "WareType" }],

    labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],

    options: [{ type: Schema.Types.ObjectId, ref: "Option" }],

    wares: [{ type: Schema.Types.ObjectId, ref: "Ware" }],

    address: { state: String, city: String, parish: String, text: String },

    premium: { type: Boolean, default: false },
    onlineShop: { type: Boolean, default: false },
    location: { type: { type: String }, coordinates: [Number] },

    pics: [String],
    picsRef: [{ type: Schema.Types.ObjectId, ref: "File" }],

    etPic: String,

    staticMap: String,

    licensePic: String,
    licensePicRef: { type: Schema.Types.ObjectId, ref: "File" },

    creator: { type: Schema.Types.ObjectId, ref: "User" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },

    rates: [{ type: Schema.Types.ObjectId, ref: "Rate" }],

    state: { type: Schema.Types.ObjectId, ref: "State" },
    city: { type: Schema.Types.ObjectId, ref: "City" },

    // Parvane Kasb details
    guildId: Number,
    issueDate: Date,
    expirationDate: Date,
    steward: Boolean,
    personType: String,
    activityType: String,
    isicCode: Number,
    postalCode: Number,

    raste: { type: Schema.Types.ObjectId, ref: "Raste" },
    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },
    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "otaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

CenterSchema.index({ location: "2dsphere" });

const ModelClass = mongoose.model("Center", CenterSchema);

module.exports = ModelClass;
