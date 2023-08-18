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

const findOffersByIdArray = (offersId) => {
  // debugger;
  //console.log("offers inside action:", offersId);
  return new Promise(async function (resolve, reject) {
    const ridesAsOffers = await Ride.find({ _id: { $in: offersId } });

    resolve(ridesAsOffers);
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

//module.exports.getSubsFromMongo = subsMongoPromise;
module.exports = {
  getSubsFromMongo: subsMongoPromise,
  findOffersByIdArray,
  addOffersToMongo,
  addAskToRideMongo,
};
