const Router = require('express');
const neo4j = require('neo4j-driver');
const Locality = require('../models/Locality.js');
const Role = require('../models/Role');
const Ride = require('../models/Ride');
const { check, validationResult } = require('express-validator');

const router = new Router();
// const config = require ("config");
// const secretKey = config.get("secretKey");

///////neo4j/////////
const uri = 'bolt://54.197.15.138:7687';
const user = 'neo4j';
const password = 'qwe123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
//const session = driver.session({ database: 'neo4j' });
const session = driver.session();

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
  console.log('from api create ride');
  console.log(req.body);
  try {
    const { localityFrom, destination, date, user } = req.body;
    //const user = '625474cdaeaabfaac86eda54';

    // const userRole = new Role();
    // await userRole.save()
    // const adminRole = new Role({value:"Admin"})
    // await adminRole.save()
    //const date = new Date (when)

    const ride = new Ride({ localityFrom, destination, date, user });
    await ride.save();
    res.status(201).json('new ride created');
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'ride not created' }, e);
  }
});

router.get('/createroles', async (req, res) => {
  try {
    const userRole = new Role();
    const adminRole = new Role({ value: 'Admin' });
    await userRole.save();
    await adminRole.save();
    res.json('roles created');
  } catch (e) {
    console.log(e);
    //res.send({message: "Server error"})
    res.status(500).json({ message: 'roles not created' });
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
    let date = req.query.date;
    //const search = await Ride.find({date: date})
    //const search = await Ride.find({date:{$gte:"2022-06-06"}})
    //const search = await Ride.find({date:{$gte:"2022-05-20", $lte:"2022-06-01"}})
    const search = await Ride.find({ date: date });
    console.log(search);
    return res.status(200).json(search);
  } catch (e) {
    console.log(e);
    //res.send({message: "Server error"})
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

module.exports = router;
