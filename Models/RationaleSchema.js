const mongoose = require('mongoose');

const RationaleSchema = new mongoose.Schema({
    Module: String,
    RationaleSummary: String,
    RationaleText: String,
    Enable: String,
    RationaleID: String,
    GroupID: String,
    Sequence: String,
}, { strict: false });

const Rationale = mongoose.model('rationales', RationaleSchema);

module.exports = Rationale;
