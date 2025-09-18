const Alumni = require("../models/Alumni");

exports.getAlumni = async (req, res) => {
  const alumni = await Alumni.find();
  res.json(alumni);
};

exports.addAlumni = async (req, res) => {
  try {
    const alumni = new Alumni(req.body);
    await alumni.save();
    res.status(201).json(alumni);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
