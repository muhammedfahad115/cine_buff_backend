const mongoose = require("mongoose");

const MedicalBillSchema = new mongoose.Schema({
      patientName: {type: String, required: true},
      procedureCode: {type: String, required: true},
      procedureDescription: {type: String, required: true},
      cost: {type: Number, required: true},
      dateOfService: {type: String, required: true},
      doctorName: {type: String, required: true},
      specialtyCode: {type: String, required: true},
      phoneNumber: {type: Number, required: true},
      billStatus: {default: "Pending", type: String, required: true},
}, { strict: false });

const MedicalBill = new mongoose.model("medicalbills", MedicalBillSchema);

module.exports = MedicalBill;