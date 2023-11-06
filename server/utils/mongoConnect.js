const mongoose = require("mongoose");
// const config = require("config");
require("dotenv").config();
const DB_URL = process.env.DB_URL;
const DBListener = require("./mongoListener");

const mongoConnect = async () => {
  try {
    // await mongoose.connect(config.get('dbUrl'), {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    DBListener.init();
    db.on("error", (error) => {
      console.error(error.message);
      mongoose.disconnect();
    }); // заменить на logError()
    db.on("connected", () => {
      console.log("#connected: connected to mongoose");
    });
    db.on("open", () => {
      console.log("#open: connected to mongoose");
    });
    db.on("disconnected", () => {
      console.log("mongoose disconnected");
    });
    db.on("close", () => {
      console.log("#close: mongoose disconnected");
    });
    db.on("fullsetup", () => {
      console.log("#fullsetup");
    });
    db.on("all", () => {
      console.log("#all");
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  mongoConnect,
};
