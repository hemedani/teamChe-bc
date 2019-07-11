const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    title: String,
    cost: Number,
    income: Boolean,
    etehadiye: { type: Schema.Types.ObjectId, ref: "Etehadiye" },
    center: { type: Schema.Types.ObjectId, ref: "Center" },
    report: { type: Schema.Types.ObjectId, ref: "Report" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelClass = mongoose.model("Payment", PaymentSchema);

module.exports = ModelClass;
