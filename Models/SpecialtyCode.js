const mongoose = require("mongoose");

const SpecialtyCodeSchema = new mongoose.Schema({
    SpecialtyCode: String,
});

const SpecialtyCode = new mongoose.model("specialtieslists", SpecialtyCodeSchema);

module.exports = SpecialtyCode;