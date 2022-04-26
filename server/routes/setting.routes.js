const Router = require ("express");
const Locality = require ("../models/Locality.js")
const Role = require("../models/Role");
const Ride = require('../models/Ride')
const {check, validationResult} =  require ('express-validator');

const router = new Router()  
// const config = require ("config");
// const secretKey = config.get("secretKey");


router.post('/createlocality', 
    [      
        check('locality', "locality field should not be empty").notEmpty(),
        check('clarification', 'clarification must be longer than 5 and shorter than 42').isLength({min:5, max:42})
    ],  
   
    async (req, res) => {
    console.log("from api create locality")
    console.log(req.body)
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uncorrect request"})
        }
        const {locality, clarification} = req.body;
        const candidate = await Locality.findOne({locality})
        if (candidate) {
            return res.status(400).json({message: `Locality ${locality} already exist`})
        }
        const point = new Locality ({locality, clarification})
        await point.save()        
        return res.status(201).json ({message: "Locality was added"}); 
        
     } catch (e) {
         console.log(e)         
         res.status(500).json({ message: "Error message"})
     }
})

router.post('/createride',
    async (req, res) => {
        console.log("from api create ride")
        console.log(req.body)
        try {
            const {localityFrom, destination, date} = req.body;

            // const userRole = new Role();
            // const adminRole = new Role({value:"Admin"})
            // await userRole.save()
            // await adminRole.save()
            //const date = new Date (when)

            const ride = new Ride({localityFrom, destination, date})
            await ride.save() 
            res.status(201).json("new ride created")

        } catch (e) {
            console.log(e)
            //res.send({message: "Server error"})
            res.status(500).json({ message: "ride not created"})
        }
   })



router.get('/createroles',
    async (req, res) => {
        try {
            const userRole = new Role();
            const adminRole = new Role({value:"Admin"})
            await userRole.save()
            await adminRole.save()
            res.json("roles created")

        } catch (e) {
            console.log(e)
            //res.send({message: "Server error"})
            res.status(500).json({ message: "roles not created"})
        }
   })

module.exports = router
