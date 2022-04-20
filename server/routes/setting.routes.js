const Router = require ("express");
const Locality = require ("../models/Locality.js")
const Role = require("../models/Role");
const {check, validationResult} =  require ('express-validator');

const config = require ("config");

const router = new Router()  //создаем объект
const secretKey = config.get("secretKey");


router.post('/createlocality', 
    [      
        check('locality', "locality field should not be empty").notEmpty(),
        check('clarification', 'clarification must be longer than 5 and shorter than 42').isLength({min:5, max:42})
    ],  
   
    async (req, res) => {
    console.log("from POST registration")
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
        return res.json ({message: "Locality was added"}); 
        
     } catch (e) {
         console.log(e)         
         res.status(500).json({ message: "Error message"})
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
