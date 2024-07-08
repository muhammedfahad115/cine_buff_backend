const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL
const connectDB = () => {
    return mongoose
        .connect( mongoURL)
        .then(() => console.log("MongoDB connected successfully"))
        .catch((error) => console.log(error, "MongoDB connection failed"));
};
module.exports = connectDB;