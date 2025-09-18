const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni" },
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
