const express = require('express');
const mongoose = require('mongoose');

const config = require('config');

const corsMiddleware = require('./middleware/cors.middleware');
const logger = require('./middleware/logger.js');

const authRouter = require('./routes/auth.routes.js');
const settingsRouter = require('./routes/setting.routes.js');
const Ride = require('./models/Ride');

const app = express();
const PORT = process.env.PORT || config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);

const start = async () => {
  try {
    mongoose.connect(config.get('dbUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // keepAlive: true,
      // keepAliveInitialDelay: 30000,
    });
    //Ride.watch().on('change', (data) => console.log(data)); //edit перенести в middleware
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error(error.message);
      mongoose.disconnect();
    }); // заменить на logError()
    db.on('connected', () => {
      console.log('#connected: connected to mongoose');
    });
    db.on('open', () => {
      console.log('#open: connected to mongoose');
    });
    db.on('disconnected', () => {
      console.log('mongoose disconnected');
    });
    db.on('close', () => {
      console.log('#close: mongoose disconnected');
    });
    db.on('fullsetup', () => {
      console.log('#fullsetup');
    });
    db.on('all', () => {
      console.log('#all');
    });
    process.on('SIGINT', function () {
      console.log('SIGINT recieved');
      server.close(() => {
        console.log('Server is closed...');
        process.exit(0);
      });

      //не срабатывает прерывание процесса при ctrl+C
      //mongoose.disconnect()
      // mongoose.connection.close(function () {
      //   console.log('Mongoose default connection is disconnected due to application termination');
      //   process.exit(0);
      // });
    });
    process.on('SIGTERM', function () {
      console.log('SIGTERM recieved');
      process.exit(0);
    });
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} process id: ${process.pid}`);
    });
  } catch (e) {
    console.error(e.message);
  }
};

start();
