const express = require("express");
const mongoose = require ("mongoose");
const config = require ("config");
const authRouter = require ("./routes/auth.routes.js")
const corsMiddleware = require('./middleware/cors.middleware')
const logger = require ('./middleware/logger.js');

const app = express();
const PORT = config.get('serverPort')

app.use(corsMiddleware)
app.use(express.json())
app.use(logger)
app.use("/api/auth", authRouter)

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