const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_DB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
};

initializeDatabase();
module.exports = { initializeDatabase };
