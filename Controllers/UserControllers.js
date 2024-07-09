const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const UserObject = {
    SignUp : async (req, res) => {
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
        return res.status(201).json({ message: "User created successfully" });
    },

    Login : async (req, res) => {
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
        return res.status(200).json({ message: "Login successful" });
    }
}

module.exports = UserObject