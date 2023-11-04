const EventEmitter = require("events");

class Emitter3 extends EventEmitter {
  constructor() {
    super();
  }
  send(message) {
    // console.log("emitted inside class3:", message);
    // this.emit("newMessage", { mes: message });
    // console.log("this:", this);
    this.emit("start5", { mes: message });
  }
}

const emitter3 = new Emitter3();
module.exports = emitter3;
