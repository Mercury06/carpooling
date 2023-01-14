const { EventEmitter } = require('events');
const emitter = new EventEmitter();
const data = {};

emitter.on('my-event', () => {
  console.log();
});

emitter.on('error', (err) => {
  console.log(err.message);
});

emitter.emit('my-event', data);
emitter.emit('error', new Error('some emitter error'));
