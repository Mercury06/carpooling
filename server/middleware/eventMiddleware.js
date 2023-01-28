const { EventEmitter } = require('events');
const emitter = new EventEmitter();
const Ride = require('./../models/Ride');

const eventEmitter = (req, res, next) => {
  try {
    Ride.watch().on('change', (next) => emitter.emit('my-event', next.fullDocument));
    emitter.on('my-event', (data) => {
      console.log('data from emitter:', data);
    });
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'Emitter error' });
  }
};

module.exports = eventEmitter;
