const EventEmitter = require("events");

const EventName = Object.freeze({
  ASK: "ASK",
  MESSAGE: "MESSAGE",
  CONFIRM: "CONFIRM",
  GREETING: "GREETING",
  CANCELLED: "CANCELLED",
  OPPORTUNE: "OPPORTUNE",
});

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
    } else return;

    // console.log("connections after subscribe", this.connections);
    console.log("connections size after remove", this.connections.size);
  }
  subscribe(client) {
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
    res.write(
      `data: ${JSON.stringify({
        message: "you have been initialized...",
      })} \n\n`
    );

    const eventListener = (data) => {
      console.log("dataListener catched emit:", data);
      console.log("data.recieverIdArray[0]", data.recieverIdArray[0]);
      if (this.connections.has(data.recieverIdArray[0])) {
        console.log("HAS***********************");
      }
      // for (let [key] of this.connections) {
      //   this.connections.has(`${userId}`)
      // }
      // if (data.event) {
      //   res.write(`event: ${data.event} \n`);
      // }
      // res.write(`event: ${data.event} \n`);
      // res.write(`data: ${data.data} \n`);
      // res.write("\n");
    };
    this.on("newSseEvent", eventListener);
    req.on("close", () => {
      this.removeListener("data", eventListener);
      this.removeHandler(userId);
      clearInterval(this.intervalId);
      // console.log("this intervals when closed", this.intervals);
      console.log(`USER ${userId} closed connection...`);
      res.write(`event: join \n`);
      // res.end();
    });
  }
  emitEvent(data) {
    this.emit("newSseEvent", data);
  }
  // newMatchRideEvent(data) {
  //   this.emit("newSseEvent", { event: EventName.OPPORTUNE, data });
  // }
}

module.exports = new SSE();

//////////////////****************************///////////////

// const mes = { message: "some data for prepared client" };
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

/////////////////////////*************************/////////

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
