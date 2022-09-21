const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const corsMiddleware = require('./middleware/cors.middleware');
const logger = require('./middleware/logger.js');

const authRouter = require('./routes/auth.routes.js');
const settingsRouter = require('./routes/setting.routes.js');

const app = express();
const PORT = config.get('serverPort');

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
    });
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error(error.message);
      mongoose.disconnect();
    }); // заменить на logError()
    db.on('open', () => {
      console.log('connected to mongoose');
    });

    db.on('disconnected', () => {
      console.log('mongoose disconnecteed');
    });
    process.on('SIGINT', function () {
      //не срабатывает прерывание процесса при ctrl+C
      //mongoose.disconnect()
      mongoose.connection.close(function () {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
      });
    });

    app.listen(PORT, () => {
      console.log('Server started on port', PORT);
    });
  } catch (e) {
    console.error(e.message);
  }
};

start();
