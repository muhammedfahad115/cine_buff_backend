const mongoose = require('mongoose');

const RationaleSchema = new mongoose.Schema({
    Module:  {type: String, required: true},
    RationaleSummary:  {type: String, required: true},
    RationaleText:  {type: String, required: true},
    Enable:  {type: String, required: true},
    RationaleID:  {type: String, required: true},
    GroupID:  {type: String, required: true},
    Sequence:  {type: String, required: true},
});

const Rationale = mongoose.model('rationales', RationaleSchema);

module.exports = Rationale;
