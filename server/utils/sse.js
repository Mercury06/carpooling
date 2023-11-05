const EventEmitter = require("events");

let streamCount = 0;

class SSE extends EventEmitter {
  constructor() {
    super();
  }

  init(req, res) {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    console.log("client connected init...");
    let id = 0;
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
      --streamCount;
      console.log("Stream closed");
    });
    console.log(`Stream ${++streamCount} created...`);
  }

  //   send(data) {
  //     this.emit("data", data);
  //   }
}

const sse = new SSE();
module.exports = sse;
