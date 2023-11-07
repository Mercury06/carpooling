const express = require("express");
const app = express();
const server = require("http").createServer(app);

require("dotenv").config();

const corsMiddleware = require("./middleware/cors.middleware");
const logger = require("./middleware/logger.js");
const connectionModule = require("./utils/mongoConnect.js");

const authRouter = require("./routes/auth.routes.js");
const businesRouter = require("./routes/busines.routes.js");
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
app.use("/api/busines", businesRouter);

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
    process.on("SIGINT", function () {
      console.log("SIGINT recieved");
      process.exit(0);
    });
    process.on("SIGTERM", function () {
      console.log("SIGTERM recieved");
      process.exit(0);
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
