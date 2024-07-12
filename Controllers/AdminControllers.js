const Rationale = require('../Models/RationaleSchema');
const User = require('../Models/UserSchema');

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
    }
}

module.exports = AdminObject;
