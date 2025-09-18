const express = require("express");
const { getAlumni, addAlumni } = require("../controllers/alumniController");

const router = express.Router();

router.get("/", getAlumni);
router.post("/", addAlumni);

module.exports = router;
