const mongoose = require("mongoose");

const mongo_url = 'mongodb+srv://pharanyali:Pr_241245@devopsproject.vvg3aml.mongodb.net/test';

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};