const mongoose  = require('mongoose');

const RationelsSpecialitiesSchema = new mongoose.Schema({
    SpecialtyCode:  {type: String, required: true},
    Enable:  {type: String, required: true},
    RationaleID:  {type: String, required: true},
    RationaleSpecialtyID:  {type: String, required: true},
});

const RationelsSpecialities = mongoose.model('rationalespecialties', RationelsSpecialitiesSchema);

module.exports = RationelsSpecialities;