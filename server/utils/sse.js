const EventEmitter = require("events");

class SSE extends EventEmitter {
  constructor() {
    super();
    // this.connections = [];
    this.connections = new Map();
  }
  removeHandler(userId) {
    if (this.connections.has(`${userId}`)) {
      console.log(`client ${userId} found in connections...`);
      this.connections.delete(`${userId}`);
    }

    // console.log("connections after subscribe", this.connections);
    console.log("connections size after remove", this.connections.size);
  }
  subscribe(client) {
    // this.connections.push(client);
    // this.connections.set(`${client.id}`, `${client.res}`);
    this.connections.set(`${client.id}`, client.res);
    // console.log("connections after subscribe", this.connections);
    console.log("connections size", this.connections.size);
  }
  init(req, res) {
    const { userId } = req.params;
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    console.log(`client ${userId} connected`);
    const client = { id: userId, res };
    this.subscribe(client);

    // res.write(`data: some data \n\n`);
    const mes = { message: "some data" };
    setInterval(() => {
      res.write(`data: ${JSON.stringify(mes)} \n\n`);
    }, 3000);
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
      console.log(`USER ${userId} closed connection...`);
      this.removeListener("data", dataListener);
      this.removeHandler(userId);
      //res.end()
      console.log("Stream closed");
      // console.log(`Client ${username} closed the stream...`);
    });
    // console.log(`new stream created...`);
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

module.exports = new SSE();
