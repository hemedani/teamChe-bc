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
    fullPath: String,

    premium: { type: Boolean, default: false },
    onlineShop: { type: Boolean, default: false },
    location: { type: { type: String }, coordinates: [Number] },

    pics: [String],
    picsRef: [{ type: Schema.Types.ObjectId, ref: "File" }],

    staticMap: String,

    creator: { type: Schema.Types.ObjectId, ref: "User" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },

    rates: [{ type: Schema.Types.ObjectId, ref: "Rate" }],

    state: { type: Schema.Types.ObjectId, ref: "State" },
    city: { type: Schema.Types.ObjectId, ref: "City" },
    parish: { type: Schema.Types.ObjectId, ref: "Parish" },

    // Parvane Kasb details
    licensePic: String,
    licensePicRef: { type: Schema.Types.ObjectId, ref: "File" },
    guildId: { type: Number, unique: true },
    issueDate: Date,
    expirationDate: Date,
    steward: { type: Boolean, default: false },
    personType: String,
    activityType: String,
    isicCode: Number,
    postalCode: { type: Number, unique: true },

    guildOwnerName: String,
    guildDegree: String,
    guildOwnerFamily: String,
    guildOwnerPhoneNumber: Number,
    identificationCode: Number,
    nationalCode: Number,
    ownerFatherName: String,
    ownerBirthDate: Date,

    waterPlaque: Number,
    registrationPlaque: Number,

    membershipFeeDate: Date,

    etPic: String,

    guildStatus: {
      type: String,
      enum: [
        "warning27",
        "shutdownPromise",
        "applicant",
        "offerDoc",
        "commissionConfirm",
        "directorAccept",
        "docInquiry",
        "paySettle",
        "payElectronicCard",
        "issueLicense",
        "receiveLicense",
        "plump"
      ],
      default: "receiveLicense"
    },

    warning27Date: Date,
    shutdownPromiseDate: Date,
    applicantDate: Date,
    offerDocDate: Date,
    commissionConfirmDate: Date,
    directorAcceptDate: Date,
    docInquiryDate: Date,
    paySettleDate: Date,
    payElectronicCardDate: Date,
    receiveLicenseDate: Date,
    issueLicenseDate: Date,
    plumpDate: Date,

    offerDocs: [String],
    offerDocsRef: [{ type: Schema.Types.ObjectId, ref: "File" }],

    inquiryDocs: [String],
    inquiryDocsRef: [{ type: Schema.Types.ObjectId, ref: "File" }],

    raste: { type: Schema.Types.ObjectId, ref: "Raste" },
    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },
    otaghAsnaf: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },
    otaghBazargani: { type: Schema.Types.ObjectId, ref: "OtaghBazargani" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

CenterSchema.index({ location: "2dsphere" });

const centerChemaModaClass = mongoose.model("Center", CenterSchema);
// centerChemaModaClass.ensureIndexes(err => {
//   console.log("==================");
//   console.log("err", err);
//   console.log("==================");
// });

module.exports = centerChemaModaClass;
