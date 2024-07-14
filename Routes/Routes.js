const express = require("express");
const { SignUp, Login, Profile, Xlsx, getMedicalBills, denyRationales, confirmDenyBill, confirmApproveBill } = require("../Controllers/UserControllers");
const router = express.Router();
const verifyToken = require("../Middleware/VerifyToken");
const { AddRationale, getUsers, getRationales, editRationale, searchRationales, addMedicalBill, getSpecialtyCodes } = require("../Controllers/AdminControllers");

router.post('/signup',SignUp);
router.post ('/login',Login);
router.get('/profile',verifyToken, Profile);
router.get('/xlsx',Xlsx);
router.post('/addrationale',verifyToken, AddRationale);
router.get('/getusers',verifyToken, getUsers);
router.get('/getrationales',verifyToken, getRationales);
router.put('/editrationales/:id',verifyToken, editRationale);
router.get('/searchrationales',verifyToken, searchRationales );
router.get('/specialtycodes', verifyToken, getSpecialtyCodes);
router.post('/addmedicalbills',verifyToken, addMedicalBill);
router.get('/getmedicalbills',verifyToken, getMedicalBills);
router.get('/denyrationales',verifyToken, denyRationales);
router.post('/confirmdenybill',verifyToken, confirmDenyBill);
router.post('/approvebill',verifyToken, confirmApproveBill);

module.exports = router;