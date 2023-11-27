const mongoose = require("mongoose");
// const config = require("config");
require("dotenv").config();
const DB_URL = process.env.DB_URL;
const DBListener = require("./mongoListener");

const mongoConnect = async () => {
  try {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 10000,
    });
    const db = mongoose.connection;
    const Ride = require("./../models/Ride");
    let cursor;
    db.on("error", (error) => {
      console.error(error.message);
      mongoose.disconnect();
    }); // заменить на logError()
    db.on("connected", () => {
      console.log("#connected: connected to db");
      cursor = Ride.watch();
      DBListener.init(cursor);
    });
    db.on("open", () => {
      console.log("#open: connected to db");
    });
    db.on("disconnected", () => {
      console.log("db disconnected");
      cursor.close();
    });
    db.on("close", () => {
      console.log("#close: mongoose disconnected");
      // changeRideCollectionEvent.close();
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  mongoConnect,
};
