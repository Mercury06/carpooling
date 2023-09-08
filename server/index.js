const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();
const config = require("config");

const corsMiddleware = require("./middleware/cors.middleware");
const logger = require("./middleware/logger.js");

const authRouter = require("./routes/auth.routes.js");
const settingsRouter = require("./routes/setting.routes.js");
const Ride = require("./models/Ride");

const { EventEmitter } = require("events");
const { getSubsFromMongo, addOffersToMongo } = require("./db/subsMongo");
const { getMatchedData } = require("./utils/matcher");
const emitter = new EventEmitter();

const app = express();
// const PORT = process.env.PORT || config.get("serverPort");
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

const start = async () => {
  try {
    // mongoose.connect(config.get("dbUrl"), {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // keepAlive: true,
      // keepAliveInitialDelay: 30000,
    });

    const db = mongoose.connection;

    const resulty = Ride.watch(); //edit
    resulty.on("change", async function (next) {
      //  debugger;
      if (next.operationType === "insert") {
        let points = next.fullDocument.points;
        let route = points.map((item) => item.localityName);
        //console.log("route:", route);
        const subs = await getSubsFromMongo(route);
        //console.log('get subs mongo:', subs);
        const matched = getMatchedData(route, subs);
        console.log("matched:", matched);
        let applicant = next.fullDocument;
        const signed = await addOffersToMongo(matched, applicant);
        console.log("signed:", signed);
      }
    });

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
      server.close(() => {
        console.log("Server is closed...");
        process.exit(0);
      });
    });
    process.on("SIGTERM", function () {
      console.log("SIGTERM recieved");
      process.exit(0);
    });
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} 
                  process id: ${process.pid} 
                  process.argv: ${process.argv}
                  process.platform: ${process.platform}
                  process.env.PORT: ${process.env.PORT} 
                  process.env.SECRET_KEY: ${process.env.SECRET_KEY}
                  process.env.DB_URL: ${process.env.DB_URL}
                  process.env.PORT: ${process.env.PORT}`);
    });
  } catch (e) {
    console.error(e.message);
  }
};

start();
