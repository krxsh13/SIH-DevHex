const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  graduationYear: Number,
  department: String,
  company: String,
  position: String,
  location: String,
  bio: String
});

module.exports = mongoose.model("Alumni", AlumniSchema);
