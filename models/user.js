const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, lowercase: true },
    name: String,
    familyName: String,
    expertise: String,
    phone: { type: Number, unique: true },
    authCode: Number,
    phoneValidate: { type: Boolean, default: false },
    password: { type: String, select: false },
    address: [
      {
        _id: Schema.Types.ObjectId,
        name: String,
        mobilePhone: Number,
        phone: Number,
        state: {
          _id: Schema.Types.ObjectId,
          name: String,
          enName: String,
          deliveryType: [{ enName: String, cost: Number, name: String, pic: String }]
        },
        town: { name: String, enName: String },
        district: String,
        text: String,
        code: Number,
        location: { type: { type: String }, coordinates: [Number] }
      }
    ],
    level: [
      {
        type: String,
        enum: [
          "normal",
          "expert",
          "owner",
          "editor",
          "author",
          "tarah",
          "admin",
          "storekeeper",
          "delivery",
          "organic.veep",
          "organic.officer",
          "organic.administrationManager",
          "organic.publicRelations",
          "organic.support",
          "organic.directorAdministration",
          "organic.unitManagerPlumbing",
          "organic.unionAffairs",
          "organic.inspector",
          "organic.commissionAffairs",
          "organic.secretariat",
          "organic.accountant",

          "organic.operatorEt",
          "organic.bossEt",
          "organic.officerEt",

          "organic.operatorAs",
          "organic.bossAs",
          "organic.officerAs"
        ],
        default: ["normal"]
      }
    ],
    centersLiked: [{ type: Schema.Types.ObjectId, ref: "Center" }],
    ownCenter: { type: Schema.Types.ObjectId, ref: "Center" },
    pic: String,
    fcmToken: String,

    etOrganization: { type: Schema.Types.ObjectId, ref: "Etehadiye" },

    asOrganization: { type: Schema.Types.ObjectId, ref: "OtaghAsnaf" },

    picRef: { type: Schema.Types.ObjectId, ref: "File" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePass = function(condidatePassword, callback) {
  bcrypt.compare(condidatePassword, this.password, (err, isMatch) => {
    if (err) {
      // console.log('Err az comparePass user methods :', err);
      return callback(err);
    }

    callback(null, isMatch);
  });
};

const ModelClass = mongoose.model("User", userSchema);

module.exports = ModelClass;
