// const Ride = require("./../models/Ride");
const { getMatchedData } = require("./matcher");
const dbService = require("../db/dbQuery");

class DBListener {
  init(cursor) {
    console.log("DBListener init...");
    // console.log("changeRideCollectionEvent in init method:", cursor);
    cursor.on("change", async function (next) {
      //  debugger;
      console.log("***next****", next);
      if (next.operationType === "insert") {
        let points = next.fullDocument.points;
        let route = points.map((item) => item.localityName);
        //console.log("route:", route);
        const subs = await dbService.getRegisteredSubs(route);
        console.log("get subs mongo*******:", subs);
        const matched = getMatchedData(route, subs);
        console.log("matched*******:", matched);
        let applicant = JSON.stringify(next.fullDocument);
        const signed = await dbService.addOffersToMongo(matched, applicant);
        console.log("signed:", signed);
      }
    });
  }
}

module.exports = new DBListener();
