const Router = require ("express");
const User = require ("../models/User")
const Role = require("../models/Role");
const bcrypt = require ("bcryptjs") 
const config = require ("config");
const jwt = require("jsonwebtoken")
const {check, validationResult} =  require ('express-validator');
//const authMiddleware = require('./../middleware/authMiddleware') //добавить 2м параметром к app.get("/users", authMiddleware, controller.getUsers)




const router = new Router()  //создаем объект
const secretKey = config.get("secretKey");


router.post('/registration', 
    [
        //check('email', 'Uncorrect email').isEmail(),
        check('username', "Username field should not be empty").notEmpty(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
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
        const {username, password} = req.body; // получим имэил и пароль из тела запроса       
        const candidate = await User.findOne({username}) // проверим существует ли пользователь с таким имэил в базе

        if (candidate) {
            return res.status(400).json({message: `User with login ${username} already exist`})
        }
        const hashPassword = bcrypt.hashSync(password, 8) // хэшируем пароль для безопасности
        const userRole = await Role.findOne({value: "User"})
        const user = new User ({username, password: hashPassword, roles: [userRole.value]})
        await user.save() //сохраним нового поьзователя в БД
        return res.json ({message: "User was created"});        
        
     } catch (e) {
         console.log(e)
         //res.send({message: "Server error"})
         res.status(500).json({ message: "Error message"})
     }
})

router.post('/login', 
   
    async (req, res) => {
    try {
        console.log("from login")
        const { username, password } = req.body;
        const user = await User.findOne ({username})
        
        if (!user) {
            return res.status(400).json({ message: "User not found"})
        }

        const isPassValid = bcrypt.compareSync(password, user.password)

        if (!isPassValid) {
            return res.status(400).json({message: "Password or email is incorrect"})
        }

        const token = jwt.sign({ id: user._id, roles: user.roles }, secretKey, { expiresIn: "1h" })
        return res.json ({
            token,
            user: {
                id: user._id,
                username: user.username,
                roles: user.roles,             
                avatar: user.avatar
            }
        })
    } catch (e) {
        console.log(e)
        //res.send({message: "Server error"})
        res.status(500).json({ message: "Error message"})
    }
})

// router.get('/createroles',
//     async (req, res) => {
//         try {
//             const userRole = new Role();
//             const adminRole = new Role({value:"Admin"})
//             await userRole.save()
//             await adminRole.save()
//             res.json("roles created")

//         } catch (e) {
//             console.log(e)
//             //res.send({message: "Server error"})
//             res.status(500).json({ message: "roles not created"})
//         }
//    })



// router.get('/auth', authMiddleware,
//     async (req, res) => {
//         try {
//             const user = await User.findOne({ _id: req.user.id })
//             const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" })
//             return res.json ({
//                 token,
//                 user: {
//                     id: user.id,
//                     email: user.email,
//                     diskSpace: user.diskSpace,
//                     usedSpace: user.usedSpace,
//                     avatar: user.avatar
//                 }
//             })
//         } catch (e) {
//             console.log(e)
//             res.send({ message: "Server error"})
//         }
//     })

module.exports = router
