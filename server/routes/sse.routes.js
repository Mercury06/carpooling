const Router = require("express");

const sseRouter = new Router();

let i = 0;

sseRouter.get("/stream", (req, res) => {
  console.log("****i*****", i);

  req.socket.addListener("close", function () {
    console.log("connection closed by client...");
    res.end();
  });

  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  i++;

  console.log("client connected...");
  // res.setHeader("Connection", "keep-alive");
  // res.setHeader("Content-Type", "text/event-stream");
  // res.setHeader("Cache-Control", "no-cache");
  res.write("data: some data \n\n");
  // res.write("id: some id \n\n");
  // emitter1.emit("start", { mes1: "run" });
  // setInterval(() => {
  //   res.write("data: some data in interval \n\n");
  // }, 5000);

  //   emitter3.on("start5", (mes) => {
  //     console.log("mes.on:", mes);
  //     res.write(`data: ${JSON.stringify(mes)} \n\n`);
  //     res.write(`data: some data inside emitter3 \n\n`);
  //     // res.write(`id: 1 \n\n`);
  //     // res.write("data: some data inside \n\n");
  //     // res.write("id: some id inside \n\n");
  //   });
  // console.log("******SERVER******", server);
  // console.log("******res.connection.server******", res.socket.server);
});

module.exports = sseRouter;
