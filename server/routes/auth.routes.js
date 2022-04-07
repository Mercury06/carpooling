const Router = require ("express");
const User = require ("../models/User")
const bcrypt = require ("bcryptjs") 
//const config = require('../config/default');
//const jwt = require("jsonwebtoken")
const {check, validationResult} =  require ('express-validator')
//const authMiddleware = require ('../middleware/auth.middleware')


const router = new Router()  //создаем объект
//const secretKey = config.secretKey;

router.post('/registration', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],    
    async (req, res) => {
    console.log("from POST reg")
    console.log(req.body)
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Uncorrect request"})
        }
        const {email, password} = req.body; // получим имэил и пароль из тела запроса
        console.log(req.body)
        const candidate = await User.findOne({email}) // проверим существует ли пользователь с таким имэил в базе

        if (candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8) // хэшируем пароль для безопасности
        const user = new User ({email, password: hashPassword})
        await user.save() //сохраним нового поьзователя в БД
        return res.json ({message: "User was created"});        
        
     } catch (e) {
         console.log(e)
         //res.send({message: "Server error"})
         res.status(500).json({ message: "Error message"})
     }
})

// router.post('/login', 
   
// async (req, res) => {
// try {
//     console.log("from login")
//     const { email, password } = req.body;
//     const user = await User.findOne ({email})
    
//     if (!user) {
//         return res.status(400).json({ message: "User not found"})
//     }

//     const isPassValid = bcrypt.compareSync(password, user.password)

//     if (!isPassValid) {
//         return res.status(400).json({message: "Password or email is incorrect"})
//     }
//     const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" })
//     return res.json ({
//         token,
//         user: {
//             id: user.id,
//             email: user.email,
//             diskSpace: user.diskSpace,
//             usedSpace: user.usedSpace,
//             avatar: user.avatar
//         }
//     })
// } catch (e) {
//     console.log(e)
//     //res.send({message: "Server error"})
//     res.status(500).json({ message: "Error message"})
// }
// })

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
