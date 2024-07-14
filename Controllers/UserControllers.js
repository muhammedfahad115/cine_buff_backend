const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");
const MedicalBill = require("../Models/MedicalBillSchema");
const SpecialityList = require("../Models/RationelsSpecialities");
const Rationale = require("../Models/RationaleSchema");


const UserObject = {
    SignUp: async (req, res) => {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await new User({
            name: name,
            email: email,
            password: hashedPassword,
        })
        newUser.save();
        const token = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ message: "User created successfully", token: token });
    },

    Login: async (req, res) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            console.log("User does not exist");
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = Jwt.sign({ id: existingUser._id, role: existingUser.role, name: existingUser.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", token: token });
    },
    Profile: async (req, res) => {
        const { id } = req.user;
        const user = await User.findById(id);
        console.log(user);
        return res.status(200).json({ message: "Profile fetched successfully", user: user });
    },
    // function for uploading excel file to database
    Xlsx: async (req, res) => {
        const filePath = 'C:\\Users\\FAHAD\\Downloads\\Rationale List Manager - Data.xlsx';
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found');
            }

            const workbook = xlsx.readFile(filePath);

            const sheetNames = workbook.SheetNames;
            // loop to iterate through each sheet in the workbook
            for (const sheetName of sheetNames) {
                const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                const collectionName = sheetName.replace(/\s/g, '');
                // check if the collection already exists in the database and if not, create it
                if (mongoose.connection.models[collectionName]) {
                    console.log(`Collection '${collectionName}' already exists.`);
                } else {
                    const schema = new mongoose.Schema({}, { strict: false });
                    const collection = mongoose.connection.model(collectionName, schema);
                    const insertResult = await collection.insertMany(sheetData);
                    console.log(`Inserted ${insertResult.length} documents into ${collectionName} collection`);
                }
            }

            console.log('All sheets processed.');
            res.status(200).json({ message: 'All sheets processed successfully' });

        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Failed to process Excel file' });
        } finally {
            console.log('Process completed.');
        }
    },
    getMedicalBills: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const skip = (page - 1) * limit;
            const medicalBills = await MedicalBill.find({billStatus: 'Pending'})
                .skip(skip)
                .limit(limit);
            const totalCount = await MedicalBill.countDocuments();

            return res.status(200).json({
                message: "Medical bills fetched successfully",
                medicalBills,
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    denyRationales: async (req, res) => {
        try {
          const { specialtyCode } = req.query;
      
          const specialties = await SpecialityList.aggregate([
            { $match: { SpecialtyCode: specialtyCode, Enable: '0' } },
            {
              $lookup: {
                from: 'rationales',
                localField: 'RationaleID',
                foreignField: 'RationaleID',
                as: 'rationaleDetails'
              }
            },
            { $unwind: '$rationaleDetails' },
            {
              $group: {
                _id: '$SpecialtyCode',
                rationales: { $push: '$rationaleDetails' }
              }
            }
          ]);
      
          if (!specialties || specialties.length === 0) {
            return res.status(404).json({ error: `Specialty with code ${specialtyCode} not found or no enabled specialties found.` });
          }
      
          const rationales = specialties[0].rationales;
      
          if (!rationales || rationales.length === 0) {
            return res.status(404).json({ error: 'Rationales not found.' });
          }
      
          return res.status(200).json({ message: 'Rationales fetched successfully', rationales });
        } catch (error) {
          console.error('Error fetching deniable rationales:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },
      confirmDenyBill : async (req, res) => {
        try {
          const { billId, denyReason } = req.body;
          console.log('billId:', billId, 'denyReason:', denyReason);
          const bill = await MedicalBill.findById(billId);
          if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
          }
          bill.billStatus = 'Denied';
          bill.denyReason = denyReason;
          bill.person = req.user.name;
          await bill.save();
          return res.status(200).json({ message: 'Bill denied successfully' });
        } catch (error) {
          console.error('Error denying bill:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      },
      confirmApproveBill : async (req, res) => {
        try {
          const { billId } = req.body;
          const bill = await MedicalBill.findById(billId);
          if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
          }
          bill.billStatus = 'Approved';
          bill.person = req.user.name;
          await bill.save();
          return res.status(200).json({ message: 'Bill approved successfully' });
        } catch (error) {
          console.error('Error approving bill:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }
}

module.exports = UserObject