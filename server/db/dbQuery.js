const Ask = require("../models/Ask");
const Dialog = require("../models/Dialog");
const Ride = require("../models/Ride");
const User = require("../models/User");

//find ask matched the route
const getRegisteredSubs = (points) => {
  // debugger;
  return new Promise(async function (resolve, reject) {
    const subs = await Ask.find({
      confirmed: false,
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
          offers: JSON.parse(applicant),
        },
      }
    );
    resolve(signed);
  });
};

const addNotifyToUser = (usersToNotify, initiator, eventType) => {
  //debugger;
  console.log("eventType", eventType);
  return new Promise(async function (resolve, reject) {
    const signed = User.updateMany(
      { _id: { $in: usersToNotify } },
      {
        $push: {
          notifications: {
            initiator,
            event: eventType,
          },
        },
      }
    );
    resolve(signed);
  });
};

const addAskToRide = (rideItemId, applicant) => {
  // debugger;
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
  const { state } = payload;
  //console.log("state in method:", state);
  const rideItemId = state.rideItem._id;
  const askItemId = state.askItem._id;

  // console.log("rideItemId in method", rideItemId);
  // console.log("askItem._id in method", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ride.updateMany(
      { _id: rideItemId },
      {
        $push: {
          passengers: state.askItem,
        },
        $pull: {
          asks: { _id: askItemId },
        },
      }
    );
    resolve(signed);
  });
};

const modifyAskAfterConfirmMongo = (payload) => {
  // debugger;
  const { state } = payload;
  const askItemId = state.askItem._id;
  const rideItemId = state.rideItem._id;

  return new Promise(async function (resolve, reject) {
    const signed = Ask.updateMany(
      { _id: askItemId },
      {
        confirmed: true,
        $push: {
          agreeded: state.rideItem,
        },
        $pull: {
          offers: { _id: rideItemId },
        },
      }
    );
    resolve(signed);
  });
};

const deleteConfirmationInRide = (payload) => {
  //debugger;
  //console.log("payload in deleteConfirmationInRide", payload);
  const { confirmedOffer, askItem } = payload;
  const confirmedOfferId = confirmedOffer._id;
  const askItemId = askItem._id;
  // console.log("rideItemId in payload", confirmedOfferId);
  // console.log("askItemId in payload", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ride.updateMany(
      { _id: confirmedOfferId },
      {
        $pull: {
          passengers: { _id: askItemId },
        },
      }
    );
    resolve(signed);
  });
};

const deleteRide = (payload) => {
  //debugger;
  //console.log("payload in deleteConfirmationInRide", payload);
  const rideId = payload._id;
  console.log("payload._id:", rideId);

  return new Promise(async function (resolve, reject) {
    const signed = Ride.deleteOne({ _id: rideId });
    resolve(signed);
  });
};

const modifyAskAfterDeleteRide = (payload) => {
  //debugger;
  console.log("in modifyAskAfterDeleteRide:", payload);
  const passengersIdArray = payload.passengers.map((item) => item._id);
  console.log("passengersIdArray:", passengersIdArray);
  // const { state } = payload;
  // const rideItemId = state.rideItem._id;
  // const askItemId = state.askItem._id;

  return new Promise(async function (resolve, reject) {
    const signed = Ask.updateMany(
      { _id: { $in: passengersIdArray } },
      {
        confirmed: false,
        $set: {
          agreeded: [],
        },
      },
      {}
    );
    resolve(signed);
  });
};

const updateDialog = (author, content, referedAsk) => {
  //debugger;

  return new Promise(async function (resolve, reject) {
    const signed = Dialog.updateMany(
      { referedAsk: referedAsk },
      {
        $push: {
          body: {
            author: author,
            content: content,
          },
        },
      }
    );
    resolve(signed);
  });
};

const modifyAskAfterUnconfirm = (payload) => {
  //debugger;
  const { confirmedOffer, askItem } = payload;
  const askItemId = askItem._id;
  const confirmedOfferId = confirmedOffer._id;
  console.log("confirmedOfferId in modifyAskAfterUnconfirm", confirmedOfferId);
  console.log("askItemId in modifyAskAfterUnconfirm", askItemId);
  return new Promise(async function (resolve, reject) {
    const signed = Ask.updateMany(
      { _id: askItemId },
      {
        confirmed: false,
        $pull: {
          agreeded: { _id: confirmedOfferId },
        },
      }
    );
    resolve(signed);
  });
};

module.exports = {
  getRegisteredSubs,
  findOffersByIdArray,
  findAsksByIdArray,
  addOffersToMongo,
  addNotifyToUser,
  addAskToRide,
  modifyAskAfterConfirmMongo,
  deleteConfirmationInRide,
  deleteRide,
  updateDialog,
  modifyAskAfterDeleteRide,
  modifyAskAfterUnconfirm,
  // removeItemFromAsks,
  confirmAskToRideMongo,
};
