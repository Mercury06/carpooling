const User = require("../models/User");
const Role = require("../models/Role");
const Ride = require("../models/Ride");
const Ask = require("../models/Ask");
const Dialog = require("../models/Dialog.js");
const Locality = require("../models/Locality.js");
const dbService = require("../db/dbQuery.js");
const { findMatchingRides } = require("../utils/matcher.js");
const { getGraphData } = require("../db/neo4j.js");
const EventTypes = require("../utils/constants");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");

// const secretKey = config.get("secretKey") || process.env.SECRET_KEY;
const secretKey = process.env.SECRET_KEY;

class RideController {
  async createlocality(req, res, next) {
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
  async createride(req, res, next) {
    try {
      const { localityFrom, destination, date, user } = req.body;
      // console.log('localityFrom.id:', localityFrom.id);
      // console.log('destination.id:', destination.id);
      // console.log("user:", user);

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
  }
  async deleteRide(req, res, next) {
    try {
      const { payload } = req.body;
      //console.log("payload delete ride:", payload);
      await dbService.deleteRide(payload);
      await dbService.modifyAskAfterDeleteRide(payload);

      return res.status(200).json("ride deleted");
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "unconfirm exception" });
    }
  }

  async createAsk(req, res, next) {
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
  }
  async addAskToRide(req, res, next) {
    try {
      const { rideItem, applicant } = req.body;
      const rideItemId = rideItem._id;
      const result = await dbService.addAskToRide(rideItemId, applicant);
      let usersToNotify = [];
      usersToNotify.push(rideItem.user);
      const eventType = EventTypes.ASK;
      let initiator = applicant._id;
      await dbService.addNotifyToUser(usersToNotify, initiator, eventType);

      return res
        .status(200)
        .json({ message: "ask added to ride", status: "OK", data: result });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .json({ message: "ask not added", status: "error" }, e);
    }
  }
  async fetchDialog(req, res, next) {
    try {
      const { author, content, participants, referedAsk } = req.body;
      // console.log("payload in fetch-dialog", req.body);
      const result = await Dialog.findOne({ referedAsk: referedAsk });
      // console.log("result.data:", result);
      if (!result) {
        const dialog = new Dialog({
          participants,
          referedAsk,
          body: [
            {
              author: author,
              content: content,
            },
          ],
        });
        await dialog.save();
        res.status(201).json({
          status: "OK",
          message: "new dialog created",
          data: dialog,
        });
      } else {
        res.status(200).json({
          status: "OK",
          message: "dialog found in database",
          data: result,
        });
      }
    } catch (e) {
      return res.status(500).json({ message: "", error: e });
    }
  }
  async updateDialog(req, res, next) {
    //debugger;
    try {
      const { author, content, referedAsk } = req.body;
      //   console.log("req.body", req.body);
      //   console.log("participants:", participants);
      //   console.log("referedAsk:", referedAsk);
      //   console.log("author:", author);
      //   console.log("content:", content);

      const updateResult = await dbService.updateDialog(
        author,
        content,
        referedAsk
      );
      console.log("updateResult:", updateResult);
      return res.status(200).json({ message: "dialog updated", status: "OK" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "", error: e });
    }
  }
  async findMyAsk(req, res, next) {
    try {
      const { id } = req.params;
      const asks = await Ask.find({ user: id });
      return res.status(200).json(asks);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "asks not found" });
    }
  }
  async confirmAsk(req, res, next) {
    try {
      const payload = req.body;
      console.log(payload);
      await dbService.confirmAskToRideMongo(payload);
      await dbService.modifyAskAfterConfirmMongo(payload);
      let usersToNotify = [];
      usersToNotify.push(payload.state.askItem.user);
      const eventType = EventTypes.CONFIRM;
      let initiator = payload.state.rideItem._id;
      await dbService.addNotifyToUser(usersToNotify, initiator, eventType);
      return res.status(200).json("ask confirmed");
    } catch (e) {
      process.stdout.write(e);
      res.status(500).json({ message: "rides not found" });
    }
  }
  async unconfirmAsk(req, res, next) {
    try {
      const { payload } = req.body;
      //console.log("payload unconfirm:", payload);
      await dbService.deleteConfirmationInRide(payload);
      await dbService.modifyAskAfterUnconfirm(payload);
      //console.log("resulty:", result);
      return res.status(200).json("confirmation rejected");
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "unconfirm exception" });
    }
  }
  async findAskById(req, res, next) {
    const { id } = req.params;
    console.log("id in params:", id);
    try {
      const ask = await Ask.findOne({ _id: id });
      return res.status(200).json(ask);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "ask not found" });
    }
  }
  async findAsks(req, res, next) {
    try {
      const payload = req.body;
      // console.log("payload:", payload);
      const result = await dbService.findAsksByIdArray(payload);
      // console.log("resulty:", result);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "asks not found" });
    }
  }
  async findMyRides(req, res, next) {
    const { id } = req.params;
    try {
      //console.log(id);
      const myRides = await Ride.find({ user: id });

      // console.log("emitter3", emitter3);
      // emitter3.emit("start", { mes: "run3" });
      return res.status(200).json(myRides);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "rides not found" });
    }
  }
  async findNotifications(req, res, next) {
    const { id } = req.params;
    try {
      const notifications = await User.findOne(
        { _id: id },
        { notifications: 1 }
      );
      // console.log("notifications", notifications);
      return res.status(200).json(notifications);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "notifications not found" });
    }
  }
  async findRideById(req, res, next) {
    const { id } = req.params;
    try {
      const ride = await Ride.findOne({ _id: id });
      // console.log(ride);
      return res.status(200).json(ride);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "rides not found" });
    }
  }
  async findOffers(req, res, next) {
    try {
      const payload = req.body;
      // console.log("payload:", payload);
      const result = await dbService.findOffersByIdArray(payload);
      // console.log("resulty:", result);
      // console.log("offersIdArray:", offersIdArray);
      // const offers = await Ride.find({ user: id });
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "rides not found" });
    }
  }
  async findLocs(req, res, next) {
    try {
      const locs = await Locality.find().sort({ locality: 1 });

      return res.status(200).json(locs);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "localities not found" });
    }
  }
  async findLocality(req, res, next) {
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
  }
  async findRidesBySearchParams(req, res, next) {
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
  }
}

module.exports = new RideController();
