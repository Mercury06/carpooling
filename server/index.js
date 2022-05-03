const express = require("express");
const mongoose = require ("mongoose");
const config = require ("config");
const bodyParser = require("body-parser");

const corsMiddleware = require('./middleware/cors.middleware')
const logger = require ('./middleware/logger.js');

const authRouter = require ("./routes/auth.routes.js")
const settingsRouter = require ("./routes/setting.routes.js")

const app = express();
const PORT = config.get('serverPort')

app.use(corsMiddleware)
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger)
app.use("/api/auth", authRouter)
app.use("/api/settings", settingsRouter)


const start = async () => {
    try{
        mongoose.connect(config.get("dbUrl"))

        app.get ("/", (req, res) => {
            res.send('Some text');
        })
        app.listen(PORT, () => {console.log("Server started on port", PORT)})
        
    } catch (e) {

    }
}

start ()