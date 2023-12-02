const EventEmitter = require("events");

class SSE extends EventEmitter {
  constructor() {
    super();
    // this.connections = [];
    this.connections = new Map();
  }

  removeHandler(userId) {
    if (this.connections.has(`${userId}`)) {
      this.connections.delete(`${userId}`);
      console.log(`client ${userId} removed from connections...`);
    }

    // console.log("connections after subscribe", this.connections);
    console.log("connections size after remove", this.connections.size);
  }
  subscribe(client, intervalId) {
    // this.connections.push(client);
    // this.connections.set(`${client.id}`, `${client.res}`);
    this.connections.set(`${client.id}`, client.res);
    // this.intervals.push(intervalId);
    // console.log("connections after subscribe", this.connections);
    console.log("connections size when subscribe", this.connections.size);
  }
  init(req, res) {
    const { userId } = req.params;
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    console.log(`client ${userId} connected`);
    console.log("connections size when init", this.connections.size);
    const client = { id: userId, res };
    this.subscribe(client);
    for (let [key] of this.connections) {
      console.log("key:", key);
    }

    // res.write(`data: some data \n\n`);
    const mes = { message: "some data for prepared client" };
    // setInterval(() => {
    //   res.write(`data: ${JSON.stringify(mes)} \n\n`);
    // }, 3000);
    // this.intervalId = setInterval(() => {
    //   if (this.connections.has("625474cdaeaabfaac86eda54")) {
    //     const preparedClient = this.connections.get("625474cdaeaabfaac86eda54");
    //     // console.log("preparedClient found...");
    //     preparedClient.write(`data: ${JSON.stringify(mes)} \n\n`);
    //   }
    // }, 3000);

    // this.on("kiss", () => {
    //   const mes = { message: "some data for prepared client" };
    //   console.log("catched emit...");
    //   if (this.connections.has("625474cdaeaabfaac86eda54")) {
    //     const preparedClient = this.connections.get("625474cdaeaabfaac86eda54");
    //     // console.log("preparedClient found...");
    //     preparedClient.write(`data: ${JSON.stringify(mes)} \n\n`);
    //   }
    // });

    const dataListener = (data) => {
      console.log("data init:", data);
      if (data.event) {
        res.write(`event: ${data.event} \n`);
      }
      res.write(`event: ${data.data} \n`);
      res.write("\n");
    };
    this.on("data", dataListener);
    req.on("close", () => {
      this.removeListener("data", dataListener);
      this.removeHandler(userId);
      clearInterval(this.intervalId);
      // console.log("this intervals when closed", this.intervals);
      console.log(`USER ${userId} closed connection...`);
      res.write(`event: join \n`);
      // res.end();

      // console.log(`Client ${username} closed the stream...`);
    });
    // console.log(`new stream created...`);
  }

  //   send(data) {
  //     this.emit("data", data);
  //   }
  // send(clientId) {
  //   console.log("got params...");
  //   let result = this.connections.find((client) => client.id === clientId);
  //   console.log("client found in array in send method:", result);
  //   setInterval(() => {
  //     result.res.write(`data: ${JSON.stringify("got client")} \n\n`);
  //   }, 3000);
  // }
}

module.exports = new SSE();
