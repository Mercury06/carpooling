const EventEmitter = require("events");

class Emitter extends EventEmitter {
  constructor() {
    super();
  }
  newMatchRideEvent(asks) {
    // console.log("emitted inside class3:", message);
    // this.emit("newMessage", { mes: message });
    // console.log("this:", this);
    this.emit("data5", { data: asks });
  }
}
module.exports = new Emitter();
