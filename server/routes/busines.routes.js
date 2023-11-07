const Router = require("express");
const Locality = require("../models/Locality.js");
//const Role = require('../models/Role');
const { check, validationResult } = require("express-validator");
const Dialog = require("../models/Dialog.js");

const { getGraphData } = require("../db/neo4j.js");
const { findMatchingRides } = require("../utils/matcher.js");
const database = require("../db/dbQuery.js");
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

module.exports = router;
