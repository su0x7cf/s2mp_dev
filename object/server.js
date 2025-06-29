// All imports
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const mongoose = require("mongoose");
require("dotenv/config");

// Express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  try {
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(`Error starting server`, error);
  }
});

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {})
// .then(() => {
//     console.log("Connected to MongoDB");
// })
// .catch((error) => {
//     console.log("Error connecting to MongoDB", error);
// });

// // import models
// require("./models/User");
// require("./models/TwoFactorCode");

// // import routes
require("./routes/objectRoutes")(app);