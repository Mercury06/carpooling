const Router = require("express");
const Locality = require("../models/Locality.js");
//const Role = require('../models/Role');
const Ride = require("../models/Ride");
const Ask = require("../models/Ask");
const Dialog = require("../models/Dialog.js");
const { check, validationResult } = require("express-validator");
const { getGraphData } = require("./../db/neo4j");
const { findMatchingRides } = require("../utils/matcher.js");
const {
  addAskToRideMongo,
  findOffersByIdArray,
  findAsksByIdArray,
  removeItemFromAsks,
  confirmAskToRideMongo,
  modifyAskAfterConfirmMongo,
  deleteConfirmationInRide,
  modifyAskAfterUnconfirm,
} = require("../db/subsMongo.js");

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

  async (req, res) => {
    console.log("from api create locality");
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Uncorrect request",
        });
      }
      const { locality, clarification } = req.body;
      const candidate = await Locality.findOne({ locality });
      if (candidate) {
        return res
          .status(400)
          .json({ message: `Locality ${locality} already exist` });
      }
      const point = new Locality({ locality, clarification });
      await point.save();
      return res.status(201).json({ message: "Locality was added" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error message" });
    }
  }
);

router.post("/createride", async (req, res) => {
  // console.log('from api create ride');
  // console.log(req.body);
  try {
    const { localityFrom, destination, date, user } = req.body;
    // console.log('localityFrom.id:', localityFrom.id);
    // console.log('destination.id:', destination.id);
    console.log("user:", user);

    //const points = await getGraphData(localityFrom.id, destination.id);
    const { cities, direction } = await getGraphData(
      localityFrom.id,
      destination.id
    );
    //console.log('apii data:', cities);
    const points = cities;

    const ride = new Ride({
      localityFrom,
      destination,
      points,
      direction,
      date,
      user,
    });
    await ride.save();
    return res.status(201).json("new ride created");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "ride not created" });
  }
});

router.post("/createask", async (req, res) => {
  try {
    const { localityFrom, destination, date, user } = req.body;
    // console.log("localityFrom.id:", localityFrom.id);
    // console.log("destination.id:", destination.id);
    // console.log("user:", user);

    //const { cities, direction } = await getGraphData(localityFrom.id, destination.id);
    //console.log('apii data:', cities);
    //const points = cities;
    const ask = new Ask({
      localityFrom,
      destination,
      //points,
      //direction,
      date,
      user,
    });
    const result = await ask.save();
    //console.log("askSaveResult:", result);
    return res
      .status(201)
      .json({ message: "new ask created", status: "OK", result });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "ask not created" }, e);
  }
});

router.post("/addasktoride", async (req, res) => {
  try {
    const { rideItemId, applicant } = req.body;
    // console.log("rideId:", rideId);
    // console.log("applicant:", applicant);
    const result = await addAskToRideMongo(rideItemId, applicant);
    return res
      .status(200)
      .json({ message: "ask added to ride", status: "OK", result });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: "ask not added", status: "error" }, e);
  }
});

router.post("/createdialog", async (req, res) => {
  try {
    const { participants, content } = req.body;
    console.log("participants", participants);
    console.log("content", content);

    const dialog = new Dialog({
      participants,
      content,
    });
    await dialog.save();
    return res
      .status(201)
      .json({ message: "new dialog created", status: "OK" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "dialog not created" }, e);
  }
});

//return all asks by user id for asks container
router.get("/findmyask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const asks = await Ask.find({ user: id });
    //console.log(rides)
    return res.status(200).json(asks);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "asks not found" });
  }
});

// router.get("/timer", async (req, res) => {
//   try {
//     setTimeout(() => {
//       return res.status(200).json("response from timeOut");
//     }, 6000);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ message: "asks not found" });
//   }
// });
// router.get("/getoffers/:id", async (req, res) => {          //offers lready exist (delete)
//   try {
//     const { id } = req.params;
//     const asks = await Ask.find({ user: id });
//     console.log(rides)
//     return res.status(200).json(asks);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ message: "asks not found" });
//   }
// });

// router.post("/remove", async (req, res) => {
//   try {
//     const result = await removeItemFromAsks();
//     return res.status(200).json({ message: "removed", status: "OK", result });
//   } catch (e) {
//     console.log(e);
//     return res.status(400).json({ message: "not removed", status: "error" }, e);
//   }
// });

router.post("/confirm-ask", async (req, res) => {
  try {
    const payload = req.body;
    //console.log("payload confirm-ask:", payload);
    await confirmAskToRideMongo(payload);
    await modifyAskAfterConfirmMongo(payload);
    //console.log("resulty:", result);
    return res.status(200).json("ask confirmed");
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});

router.post("/unconfirm", async (req, res) => {
  try {
    const payload = req.body;
    //console.log("payload unconfirm:", payload);
    await deleteConfirmationInRide(payload);
    await modifyAskAfterUnconfirm(payload);
    //console.log("resulty:", result);
    return res.status(200).json("confirmation rejected");
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "unconfirm exception" });
  }
});

router.get("/findaskbyid/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id in params:", id);
  try {
    const ask = await Ask.find({ _id: id });
    return res.status(200).json(ask);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "asks not found" });
  }
});

router.post("/findasks", async (req, res) => {
  try {
    const payload = req.body;
    console.log("payload:", payload);
    const result = await findAsksByIdArray(payload);
    console.log("resulty:", result);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});

//return all rides by user id for rides container
router.get("/findmyrides/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //console.log(id);
    const myRides = await Ride.find({ user: id });
    return res.status(200).json(myRides);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});

//find ride item by itemId
router.get("/findridebyid/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ride = await Ride.find({ _id: id });
    console.log(ride);
    return res.status(200).json(ride);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});
router.post("/findoffers", async (req, res) => {
  try {
    const payload = req.body;
    console.log("payload:", payload);
    const result = await findOffersByIdArray(payload);
    console.log("resulty:", result);
    // console.log("offersIdArray:", offersIdArray);
    // const offers = await Ride.find({ user: id });
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});

router.get("/findlocs", async (req, res) => {
  try {
    const locs = await Locality.find().sort({ locality: 1 });
    //console.log(rides)
    // res.on("finish", () => {
    //   console.log("res finish");
    // });
    // res.on("close", () => {
    //   console.log("res close");
    // });
    return res.status(200).json(locs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "localities not found" });
  }
});

router.get("/findridesbysearchparams", async (req, res) => {
  try {
    //console.log('req.query:', req.query);
    let date = req.query.date;
    let localityFrom = req.query.localityFrom;
    //console.log(localityFrom);
    let destination = req.query.destination;
    //console.log(destination);

    const search = await Ride.find({
      $and: [
        { "points.localityName": localityFrom },
        { "points.localityName": destination },
        { date: date },
      ],
    });
    //console.log("seArch:", search);
    const matchedRides = findMatchingRides(search, localityFrom, destination);
    //console.log("matchedRides:", matchedRides);
    return res.status(200).json(matchedRides);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "rides not found" });
  }
});

router.get("/findlocality", async (req, res) => {
  try {
    // const searchName = req.query.search
    // let locality = await Locality.find({})
    // locality = locality.filter(item => item.locality.includes(searchName))
    // return res.json(locality)
    // let payload = req.body.payload.trim();
    // let {payload} = req.body;
    let payload = req.query.search;
    //console.log("from setting.routes.js:", payload)
    let search = payload
      ? await Locality.find({
          locality: { $regex: new RegExp("^" + payload + ".*", "i") },
        }).exec()
      : [];
    search = search.slice(0, 10);
    return res.status(200).json(search);
  } catch (e) {
    console.log(e);
    //res.send({message: "Server error"})
    res.status(400).json({ message: "search error" });
  }
});

module.exports = router;
