const Router = require("express");
const sse = require("./../utils/sse.js");
//const Role = require('../models/Role');
const { check, validationResult } = require("express-validator");

const RideController = require("../controllers/rideController.js");

const emitter3 = require("../utils/emitter.js");

const router = new Router();

router.post(
  "/createlocality",
  [
    check("locality", "locality field should not be empty").notEmpty(),
    check(
      "clarification",
      "clarification must be longer than 5 and shorter than 42"
    ).isLength({
      min: 5,
      max: 42,
    }),
  ],
  RideController.createlocality
);

router.post("/createride", RideController.createride);

router.post("/delete-ride", RideController.deleteRide);

router.post("/createask", RideController.createAsk);

router.post("/addasktoride", RideController.addAskToRide);

router.post("/fetch-dialog", RideController.fetchDialog);

router.post("/update-dialog", RideController.updateDialog);

//return all asks by user id for asks container
router.get("/findmyask/:id", RideController.findMyAsk);

router.post("/confirm-ask", RideController.confirmAsk);

router.post("/unconfirm-ask", RideController.unconfirmAsk);

router.get("/findaskbyid/:id", RideController.findAskById);

router.post("/findasks", RideController.findAsks);

router.get("/find-notifications/:id", RideController.findNotifications);
//return all rides by user id for rides container
router.get("/findmyrides/:id", RideController.findMyRides);

//find ride item by itemId
router.get("/findridebyid/:id", RideController.findRideById);

router.post("/findoffers", RideController.findOffers);

router.get("/findlocs", RideController.findLocs);

router.get(
  "/find-rides-by-search-params",
  RideController.findRidesBySearchParams
);

router.get("/findlocality", RideController.findLocality);

router.get("/sse-ping", (req, res) => {
  const client = req.query.client;
  console.log("client in query:", client);
  sse.send(client);
  res.send("ok");
});

module.exports = router;
