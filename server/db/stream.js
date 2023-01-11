const Ride = require('../models/Ride');

const mongoStream = () => {
  Ride.watch().on('change', (data) => {
    return data;
  });
};

module.exports.mongoStream = mongoStream;
