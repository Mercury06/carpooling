const Ask = require("../models/Ask");
const Ride = require("../models/Ride");

const subsMongoPromise = (points) => {
  // debugger;
  return new Promise(async function (resolve, reject) {
    const subs = await Ask.find({
      $and: [
        {
          "localityFrom.localityName": {
            $in: points,
          },
        },
        {
          "destination.localityName": {
            $in: points,
          },
        },
      ],
    });

    resolve(subs);
  });
};

const ridesMongoPromise = (points) => {
  // debugger;
  return new Promise(async function (resolve, reject) {
    const rides = await Ask.find({
      $and: [
        {
          "localityFrom.localityName": {
            $in: points,
          },
        },
        {
          "destination.localityName": {
            $in: points,
          },
        },
      ],
    });

    resolve(subs);
  });
};
// const subsMongoPromise = async (points) => {
//   //debugger;
//   return new Promise(function (resolve, reject) {
//     const subs = ['Glasgow', 'Carlisle', 'Penrith', 'Kendal', 'Lancaster', 'Manchester'];

//     resolve(subs);
//   });
// };
const addOffersToMongo = (matched, applicant) => {
  //debugger;
  return new Promise(async function (resolve, reject) {
    const asksArray = matched.map((ask) => ask._id);
    const signed = Ask.updateMany(
      { _id: { $in: asksArray } },
      {
        $push: {
          offers: applicant,
        },
      }
    );
    resolve(signed);
  });
};

const addAskToRideMongo = (rideId, applicant) => {
  debugger;
  return new Promise(async function (resolve, reject) {
    //const asksArray = matched.map((ask) => ask._id);
    const signed = Ride.updateMany(
      { _id: rideId },
      {
        $push: {
          asks: applicant,
        },
      }
    );
    resolve(signed);
  });
};

//module.exports.getSubsFromMongo = subsMongoPromise;
module.exports = {
  getSubsFromMongo: subsMongoPromise,
  addOffersToMongo,
  addAskToRideMongo,
};
