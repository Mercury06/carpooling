const EventEmitter = require("events");
const uuid = require("uuid");

let streamCount = 0;

class SSE extends EventEmitter {
  constructor() {
    super();
    this.connections = [];
  }

  init(req, res, username) {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    console.log("client connected init...");
    const client = { id: uuid.v4(), res };
    this.connections.push(client);
    console.log("connections length", this.connections.length);
    // console.log("connections after push", this.connections);

    let id = 0;
    res.write(`data: some data \n\n`);
    // setInterval(() => {
    //   res.write("data: some data in interval \n\n");
    // }, 3000);
    const dataListener = (data) => {
      console.log("data init:", data);
      if (data.event) {
        res.write(`event: ${data.event} \n`);
      }
      res.write(`event: ${data.data} \n`);
      res.write(`id: ${++id} \n`);
      res.write("\n");
    };
    this.on("data", dataListener);
    req.on("close", () => {
      this.removeListener("data", dataListener);
      //res.end()
      --streamCount;
      console.log("Stream closed");
      console.log(`Client ${username} closed the stream...`);
    });
    console.log(`Stream ${++streamCount} created...`);
  }

  //   send(data) {
  //     this.emit("data", data);
  //   }
  send(clientId) {
    console.log("got params...");
    let result = this.connections.find((client) => client.id === clientId);
    console.log("client found in array in send method:", result);
    setInterval(() => {
      result.res.write(`data: ${JSON.stringify("got client")} \n\n`);
    }, 3000);
  }
}

const sse = new SSE();
module.exports = sse;
