// const Ride = require("./../models/Ride");
const Notifier = require("./Notifier");
const { getMatchedData } = require("./matcher");
const dbService = require("../db/dbQuery");
const sse = require("../utils/sse");
const EventTypes = require("../utils/constants");

class DBListener {
  init(cursor) {
    console.log("DBListener init...");
    // console.log("changeRideCollectionEvent in init method:", cursor);
    cursor.on("change", async function (next) {
      //  debugger;
      // console.log("***next****", next);
      if (next.operationType === "insert") {
        let points = next.fullDocument.points;
        let route = points.map((item) => item.localityName);
        //console.log("route:", route);
        let subs = await dbService.getRegisteredSubs(route);
        // console.log("get subs mongo*******:", subs);
        let matched = getMatchedData(route, subs);
        // console.log("matched*******:", matched);
        let applicant = JSON.stringify(next.fullDocument);
        let signed = await dbService.addOffersToMongo(matched, applicant);
        console.log("signed:", signed);
        let usersToNotify = matched.map((ask) =>
          JSON.stringify(ask.user).slice(1, -1)
        );
        console.log("usersToNotify:", usersToNotify);
        // add if signed
        const eventType = EventTypes.OPPORTUNE;
        await dbService.addNotifyToUser(usersToNotify, applicant, eventType);

        /////////////////////////////////////
        // const _notif = Notifier.newMatchRideNotification(matched, applicant);
        // sse.emitEvent(_notif);
        // console.log("_notif:", _notif);
        /////////////////////////////////////
      } else return;
    });
  }
}

module.exports = new DBListener();
