const Rationale = require('../Models/RationaleSchema');
const User = require('../Models/UserSchema');
const SpecialtyCode = require('../Models/SpecialtyCode');
const MedicalBill = require('../Models/MedicalBillSchema');


const AdminObject = {
    AddRationale: async (req, res) => {
        const {decisionType,groupId,module,rationale,rationaleId,rationaleSummary,sequence,specialtyCode} = req.body;
        try {
            const checkRationaleId = await Rationale.findOne({ RationaleID: req.body.rationaleId });
            if (checkRationaleId) {
                console.log(checkRationaleId, 'checkRationaleId');
                return res.status(400).json({ error: "Rationale already exists" });
            } else {
                console.log('new rationale');
                const newRationale = new Rationale({
                    Enable: decisionType,
                    GroupID: groupId,
                    Module: module,
                    RationaleText: rationale,
                    RationaleID: rationaleId,
                    RationaleSummary: rationaleSummary,
                    Sequence: sequence,
                    SpecialtyCode: specialtyCode
                });
                await newRationale.save();
                return res.status(200).json({ message: "Rationale added successfully" });
            }
        } catch (error) {
            console.error('Error:', error.message);
            return res.status(500).json({ error: 'Failed to add rationale' });
        }
    },
    getUsers: async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        try {
            const users = await User.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            const count = await User.countDocuments();
            res.json({
                users,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getRationales: async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        try {
            const rationales = await Rationale.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            const count = await Rationale.countDocuments();
            res.json({
                rationales,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    editRationale: async (req, res) => {
        try {
            const rationale = await Rationale.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Rationale updated successfully", rationale: rationale });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    searchRationales: async (req, res) => {
        const { query } = req.query;
       try {
        const rationales = await Rationale.find({ RationaleText: { $regex: `^${query}`, $options: 'i' } });
        return res.json({ rationales });
       } catch (error) {
        return res.status(500).json({ error: error.message });
       }
    },
    getSpecialtyCodes: async (req, res) => {
     try {
        const fetchSpecialtyCodes = await SpecialtyCode.find();
        return res.status(200).json({ message: "Specialty Codes fetched successfully", specialtyCodes: fetchSpecialtyCodes });
     } catch (error) {
        return res.status(500).json({ error: error.message });
     }
    },
    addMedicalBill: async (req, res) => {
        const {patientName, procedureCode, procedureDescription, cost, dateOfService, doctorName, specialtyCode, phoneNumber} = req.body;
        try {
            const existingBill = await MedicalBill.findOne({ phoneNumber: req.body.phoneNumber });
            if (existingBill) {
                return res.status(400).json({ error: "Bill already exists" });
            } else {
                const newBill = new MedicalBill({ 
                    patientName: patientName,
                    procedureCode: procedureCode,
                    procedureDescription: procedureDescription,
                    cost: cost,
                    dateOfService: dateOfService,
                    doctorName: doctorName,
                    specialtyCode: specialtyCode,
                    phoneNumber: phoneNumber
                });
                await newBill.save();
                return res.status(200).json({ message: "Bill added successfully" });
            }

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getAllMedicalBills : async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        try {
            const medicalBills = await MedicalBill.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            const count = await MedicalBill.countDocuments();
            res.status(200).json({
                medicalBills,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AdminObject;
