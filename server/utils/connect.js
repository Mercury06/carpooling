const mongoose = require("mongoose");
const config = require("config");
const DB_URL = process.env.DB_URL;

//export default connect; process.env.PORT

const connect = async function () {
  try {
    // await mongoose.connect(config.get('dbUrl'), {
    await mongoose.connect(DB_URLgit, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // keepAlive: true,
      // keepAliveInitialDelay: 30000,
    });
    const db = mongoose.connection;
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
    process.on("SIGINT", function () {
      console.log("SIGINT recieved");
      process.exit(0);
    });
    process.on("SIGTERM", function () {
      console.log("SIGTERM recieved");
      process.exit(0);
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  connect,
};
