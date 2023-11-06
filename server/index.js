const express = require("express");
const app = express();
const server = require("http").createServer(app);

require("dotenv").config();

const corsMiddleware = require("./middleware/cors.middleware");
const logger = require("./middleware/logger.js");
const connectionModule = require("./utils/mongoConnect.js");

const authRouter = require("./routes/auth.routes.js");
const settingsRouter = require("./routes/setting.routes.js");
const sseRouter = require("./routes/sse.routes.js");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(sseRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

async function start() {
  try {
    connectionModule.mongoConnect();
    process.on("uncaughtException", (err) => {
      process.stderr.write("I have got the STDERR:", err.message);
      server.close(() => process.exit(1));
      setTimeout(() => {
        process.abort();
      }, 1000).unref();
    });

    server.listen(PORT, () => {
      process.stdout.write(
        `stdout: server started on port ${PORT} process id: ${process.pid}\n`
      );
    });
  } catch (e) {
    process.stderr.write("some error occured:", e.message);
  }
}

start();

// process.on("SIGINT", function () {
//   console.log("SIGINT recieved");
//   process.exit(0);
// });
// process.on("SIGTERM", function () {
//   console.log("SIGTERM recieved");
//   process.exit(0);
// });

// const start = async () => {
//   try {
//     // mongoose.connect(config.get("dbUrl"), {
//     mongoose.connect(DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       // keepAlive: true,
//       // keepAliveInitialDelay: 30000,
//     });

//     const db = mongoose.connection;

//     const resulty = Ride.watch(); //edit
//     resulty.on("change", async function (next) {
//       //  debugger;
//       if (next.operationType === "insert") {
//         let points = next.fullDocument.points;
//         let route = points.map((item) => item.localityName);
//         //console.log("route:", route);
//         const subs = await database.getRegisteredSubs(route);
//         console.log("get subs mongo*******:", subs);
//         const matched = getMatchedData(route, subs);
//         console.log("matched*******:", matched);
//         let applicant = JSON.stringify(next.fullDocument);
//         const signed = await database.addOffersToMongo(matched, applicant);
//         console.log("signed:", signed);
//       }
//     });
//     db.on("connected", () => {
//       console.log("#connected: connected to mongoose");
//     });
//     db.on("disconnected", () => {
//       console.log("mongoose disconnected");
//     });
//     db.on("close", () => {
//       console.log("#close: mongoose disconnected");
//     });
//     db.on("error", (error) => {
//       console.error(error.message);
//       mongoose.disconnect();
//     }); // заменить на logError()
//     process.on("uncaughtException", (err) => {
//       process.stderr.write("I have got the STDERR:", err.message);
//       server.close(() => process.exit(1));
//       setTimeout(() => {
//         process.abort();
//       }, 1000).unref();
//     });
//
//     server.listen(PORT, () => {
//       process.stdout.write(`stdout: server started on port ${PORT}\n
//                                     process id: ${process.pid}
//                                     process.argv: ${process.argv}`);
//     });
//   } catch (e) {
//     process.stderr.write("I have got the STDERR:", e.message);
//   }
// };
