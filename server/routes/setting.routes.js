const Router = require('express');
const Locality = require('../models/Locality.js');
//const Role = require('../models/Role');
const Ride = require('../models/Ride');

const Ask = require('../models/Ask');
const { check, validationResult } = require('express-validator');
const { getGraphData } = require('./../db/neo4j');

const router = new Router();

router.post(
  '/createlocality',
  [
    check('locality', 'locality field should not be empty').notEmpty(),
    check('clarification', 'clarification must be longer than 5 and shorter than 42').isLength({
      min: 5,
      max: 42,
    }),
  ],

  async (req, res) => {
    console.log('from api create locality');
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Uncorrect request',
        });
      }
      const { locality, clarification } = req.body;
      const candidate = await Locality.findOne({ locality });
      if (candidate) {
        return res.status(400).json({ message: `Locality ${locality} already exist` });
      }
      const point = new Locality({ locality, clarification });
      await point.save();
      return res.status(201).json({ message: 'Locality was added' });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Error message' });
    }
  },
);

router.post('/createride', async (req, res) => {
  // console.log('from api create ride');
  // console.log(req.body);
  try {
    const { localityFrom, destination, date, user } = req.body;
    // console.log('localityFrom.id:', localityFrom.id);
    // console.log('destination.id:', destination.id);
    console.log('user:', user);

    //const points = await getGraphData(localityFrom.id, destination.id);
    const { cities, direction } = await getGraphData(localityFrom.id, destination.id);
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
    return res.status(201).json('new ride created');
    //return res.status(206).json({ message: 'new ride created', redirect_path: '/subscribe' });
    //return res.redirect('/subscribe');
    // res.writeHead(302, { Location: 'http://localhost:3000/subscribe' });
    // res.end();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'ride not created' });
  }
});

router.post('/createask', async (req, res) => {
  try {
    const { localityFrom, destination, date, user } = req.body;
    console.log('localityFrom.id:', localityFrom.id);
    console.log('destination.id:', destination.id);
    console.log('user:', user);

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
    await ask.save();
    return res.status(201).json({ message: 'new ask created', status: 'OK' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'ask not created' }, e);
  }
});

router.get('/findall', async (req, res) => {
  try {
    const rides = await Ride.find();
    //console.log(rides)
    return res.status(200).json(rides);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'rides not found' });
  }
});

router.get('/findmyask/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asks = await Ask.find({ user: id });
    //console.log(rides)
    return res.status(200).json(asks);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'asks not found' });
  }
});
router.get('/findasks', async (req, res) => {
  try {
    //const { id } = req.params;
    const asks = await Ask.find();
    //console.log(rides)
    return res.status(200).json(asks);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'asks not found' });
  }
});

router.get('/findmyrides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const myRides = await Ride.find({ user: id });
    return res.status(200).json(myRides);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'rides not found' });
  }
});

router.get('/findlocs', async (req, res) => {
  try {
    const locs = await Locality.find().sort({ locality: 1 });
    //console.log(rides)
    return res.status(200).json(locs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'localities not found' });
  }
});

router.get('/findridesby', async (req, res) => {
  try {
    //console.log('req.query:', req.query);
    let date = req.query.date;
    let localityFrom = req.query.localityFrom;
    //console.log(localityFrom);
    let destination = req.query.destination;
    //console.log(destination);

    const search = await Ride.find({
      'localityFrom.localityName': localityFrom,
      'destination.localityName': destination,
      //date: new Date('2023-01-21'),
      date,
    });

    console.log(search);
    return res.status(200).json(search);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'rides not found' });
  }
});

router.get('/findlocality', async (req, res) => {
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
          locality: { $regex: new RegExp('^' + payload + '.*', 'i') },
        }).exec()
      : [];
    search = search.slice(0, 10);
    return res.status(200).json(search);
  } catch (e) {
    console.log(e);
    //res.send({message: "Server error"})
    res.status(400).json({ message: 'search error' });
  }
});

// router.get('/findsubs', async (req, res) => {
//   try {
//     //const arr = ['Glasgow', 'Carlisle', 'Penrith', 'Kendal', 'Lancaster', 'Manchester'];
//     const subs = await Ask.find({
//       $and: [
//         {
//           'localityFrom.localityName': {
//             $in: ['Glasgow', 'Carlisle', 'Penrith', 'Kendal', 'Lancaster', 'Manchester'],
//           },
//         },
//         {
//           'destination.localityName': {
//             $in: ['Glasgow', 'Carlisle', 'Penrith', 'Kendal', 'Lancaster', 'Manchester'],
//           },
//         },
//       ],
//     });
//     return res.status(200).json(subs);
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ message: 'rides not found' });
//   }
// });

module.exports = router;
