const express = require("express");
const app = express();
const server = require("http").createServer(app);

const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

require("dotenv").config();
const config = require("config");

const corsMiddleware = require("./middleware/cors.middleware");
const logger = require("./middleware/logger.js");
const connectionModule = require("./utils/mongo_connect.js");

const authRouter = require("./routes/auth.routes.js");
const settingsRouter = require("./routes/setting.routes.js");
const sseRouter = require("./routes/sse.routes.js");
const Ride = require("./models/Ride");

const emitter3 = require("./utils/emitter");

const database = require("./db/dbQuery");
const { getMatchedData } = require("./utils/matcher");

// const PORT = process.env.PORT || config.get("serverPort");
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(sseRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

// app.get("/stream", (req, res) => {
//   console.log("****i*****", i);

//   req.socket.addListener("close", function () {
//     console.log("connection closed by client...");
//     res.end();
//   });

//   res.writeHead(200, {
//     Connection: "keep-alive",
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//   });
//   i++;

//   console.log("client connected...");
//   // res.setHeader("Connection", "keep-alive");
//   // res.setHeader("Content-Type", "text/event-stream");
//   // res.setHeader("Cache-Control", "no-cache");
//   res.write("data: some data \n\n");
//   // res.write("id: some id \n\n");
//   // emitter1.emit("start", { mes1: "run" });
//   // setInterval(() => {
//   //   res.write("data: some data in interval \n\n");
//   // }, 5000);

//   emitter3.on("start5", (mes) => {
//     console.log("mes.on:", mes);
//     res.write(`data: ${JSON.stringify(mes)} \n\n`);
//     res.write(`data: some data inside emitter3 \n\n`);
//     // res.write(`id: 1 \n\n`);
//     // res.write("data: some data inside \n\n");
//     // res.write("id: some id inside \n\n");
//   });
//   // console.log("******SERVER******", server);
//   // console.log("******res.connection.server******", res.socket.server);
// });

const start = async () => {
  try {
    // console.log("mongoDbConnection", mongoDbConnection);
    connectionModule.mongoConnect();
    const resulty = Ride.watch(); //edit
    resulty.on("change", async function (next) {
      //  debugger;
      if (next.operationType === "insert") {
        let points = next.fullDocument.points;
        let route = points.map((item) => item.localityName);
        //console.log("route:", route);
        const subs = await database.getRegisteredSubs(route);
        console.log("get subs mongo*******:", subs);
        const matched = getMatchedData(route, subs);
        console.log("matched*******:", matched);
        let applicant = JSON.stringify(next.fullDocument);
        const signed = await database.addOffersToMongo(matched, applicant);
        console.log("signed:", signed);
      }
    });

    process.on("uncaughtException", (err) => {
      process.stderr.write("I have got the STDERR:", err.message);
      server.close(() => process.exit(1));
      setTimeout(() => {
        process.abort();
      }, 1000).unref();
    });
    // const connections = server.getConnections(function (error, count) {
    //   console.log("server.getConnections:", count);
    // });
    // console.log("connections:", connections);
    server.listen(PORT, () => {
      process.stdout.write(`stdout: server started on port ${PORT}\n
                                    process id: ${process.pid}
                                    process.argv: ${process.argv}`);
    });
  } catch (e) {
    process.stderr.write("I have got the STDERR:", e.message);
  }
};

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
//     // const connections = server.getConnections(function (error, count) {
//     //   console.log("server.getConnections:", count);
//     // });
//     // console.log("connections:", connections);
//     server.listen(PORT, () => {
//       process.stdout.write(`stdout: server started on port ${PORT}\n
//                                     process id: ${process.pid}
//                                     process.argv: ${process.argv}`);
//     });
//   } catch (e) {
//     process.stderr.write("I have got the STDERR:", e.message);
//   }
// };
