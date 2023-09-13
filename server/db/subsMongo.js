const Ask = require("../models/Ask");
const Ride = require("../models/Ride");

//find ask matched the route
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

const deleteConfirmationInRide = (payload) => {
  //debugger;
  //console.log("payload in deleteConfirmationInRide");
  const { rideItem, askItem } = payload;
  const rideItemId = rideItem._id;
  const askItemId = askItem._id;
  // console.log("rideItemId in payload", rideItemId);
  // console.log("askItem._id in payload", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ride.updateMany(
      { _id: rideItemId },
      {
        $pull: {
          passengers: { _id: askItemId },
        },
      }
    );
    resolve(signed);
  });
};

const modifyAskAfterConfirmMongo = (payload) => {
  //debugger;
  console.log("in subsMongoModify:", payload);
  const { rideItem, askItem } = payload;
  const askItemId = askItem._id;
  const rideItemId = rideItem._id;
  // console.log("rideItemId in payload", rideItemId);
  // console.log("askItem._id in payload", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ask.updateMany(
      { _id: askItemId },
      {
        confirmed: true,
        $push: {
          agreeded: rideItem,
        },
        $pull: {
          offers: { _id: rideItemId },
        },
      }
    );
    resolve(signed);
  });
};

const modifyAskAfterUnconfirm = (payload) => {
  //debugger;
  //console.log("in modifyAskAfterUnconfirm:", payload);
  const { rideItem, askItem } = payload;
  const askItemId = askItem._id;
  const rideItemId = rideItem._id;
  // console.log("rideItemId in payload", rideItemId);
  // console.log("askItem._id in payload", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ask.updateMany(
      { _id: askItemId },
      {
        confirmed: false,
        $pull: {
          agreeded: { _id: rideItemId },
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
  findAsksByIdArray,
  addOffersToMongo,
  addAskToRideMongo,
  modifyAskAfterConfirmMongo,
  deleteConfirmationInRide,
  modifyAskAfterUnconfirm,
  // removeItemFromAsks,
  // confirmAskToRideMongo,
};
