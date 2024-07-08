const express = require("express");
const app = express();
require("dotenv").config();
const mongoDB = require("./Config/Config");
const cors = require("cors");
const port = 5000;

app.use(cors());

app.use(express.json());


// server will only start if the mongoDB connection is successful //
mongoDB().then(() => {
 try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
 } catch (error) {
    console.log(error, "Server failed to start");
 }
});

