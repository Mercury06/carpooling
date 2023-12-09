// const Ride = require("./../models/Ride");
const Notifier = require("./Notifier");
const { getMatchedData } = require("./matcher");
const dbService = require("../db/dbQuery");
const sse = require("../utils/sse");

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
        const signed = await dbService.addOffersToMongo(matched, applicant);
        const _notif = Notifier.newMatchRideNotification(matched, applicant);
        sse.emitEvent(_notif);
        // console.log("_notif:", _notif);

        // console.log("signed:", signed);
      } else return;
    });
  }
}

module.exports = new DBListener();
