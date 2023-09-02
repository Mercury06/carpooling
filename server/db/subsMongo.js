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

const findOffersByIdArray = (offersIdArray) => {
  // debugger;
  //console.log("offers inside action:", offersId);
  return new Promise(async function (resolve, reject) {
    const ridesAsOffers = await Ride.find({ _id: { $in: offersIdArray } });

    resolve(ridesAsOffers);
  });
};

const findAsksByIdArray = (asksIdArray) => {
  // debugger;
  //console.log("offers inside action:", offersId);
  return new Promise(async function (resolve, reject) {
    const extractedAsks = await Ask.find({ _id: { $in: asksIdArray } });

    resolve(extractedAsks);
  });
};

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

const addAskToRideMongo = (rideItemId, applicant) => {
  debugger;
  return new Promise(async function (resolve, reject) {
    //const asksArray = matched.map((ask) => ask._id);
    const signed = Ride.updateMany(
      { _id: rideItemId },
      {
        $push: {
          asks: applicant,
        },
      }
    );
    resolve(signed);
  });
};

const confirmAskToRideMongo = (payload) => {
  //debugger;
  const { rideItemId, askItem } = payload;
  const askItemId = askItem._id;
  console.log("rideItemId in payload", rideItemId);
  console.log("askItem._id in payload", askItemId);
  return new Promise(async function (resolve, reject) {
    //const asksArray = matched.map((ask) => ask._id);
    const signed = Ride.updateMany(
      { _id: rideItemId },
      {
        $push: {
          //passengers: { _id: "64f18ea04a6acd3bac23e9ab" },
          passengers: askItem,
        },
        $pull: {
          asks: { _id: askItemId },
          //asks: askItem,
        },
      }
    );
    resolve(signed);
  });
};

// const removeItemFromAsks = () => {
//   debugger;
//   return new Promise(async function (resolve, reject) {
//     //const asksArray = matched.map((ask) => ask._id);
//     const signed = Ride.updateMany(
//       { _id: "64f04ec3f6b336a01f5e7a12" },
//       {
//         $pull: {
//           asks: { _id: "64f0c11e131cda60689976aa" },
//         },
//       }
//     );
//     resolve(signed);
//   });
// };

//module.exports.getSubsFromMongo = subsMongoPromise;
module.exports = {
  getSubsFromMongo: subsMongoPromise,
  findOffersByIdArray,
  findAsksByIdArray,
  addOffersToMongo,
  addAskToRideMongo,
  // removeItemFromAsks,
  confirmAskToRideMongo,
};
