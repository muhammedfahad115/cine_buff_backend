const Rationale = require('../Models/RationaleSchema');

const AdminObject = {
    AddRationale: async (req, res) => {
        try {
            const checkRationaleId = await Rationale.findOne({ RationaleID: req.body.RationaleID });
            if (checkRationaleId) {
                return res.status(400).json({ error: "Rationale already exists" });
            } else {
                console.log('new rationale');
                const newRationale = new Rationale(req.body);
                await newRationale.save();
                return res.status(200).json({ message: "Rationale added successfully" });
            }
        } catch (error) {
            console.error('Error:', error.message);
            return res.status(500).json({ error: 'Failed to add rationale' });
        }
    }
}

module.exports = AdminObject;
