// env variables add
require('dotenv').config();

/* App constant from .env */
const { DB_URL } = process.env;
const { HTTP_PORT, HTTPS_PORT } = require('./config/server');
const isDev = process.env.NODE_ENV !== 'production';


/* Base libraries */
const fs = require('fs');
const path = require('path');
const https = require('https');

/* Express and plugins */
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const rfs = require('rotating-file-stream');
const { generator } = require('./utils/logs');

/* Database driver and plugins */
const mongoose = require('mongoose');

/* SSL certs */
const getSSLCerts = require('./config/ssl-certs');

/* Add logging */
const logDirectory = path.join(__dirname, 'logs');
// Create directory if it not exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// Create rotate file stream
const accessLogStream = rfs(generator, {
  size: '10M',
  interval: '1d', // rotate daily
  path: logDirectory,
});

/* Init app */
const server = express();

// Add assets
server.use(morgan('combined', { stream: accessLogStream }));
server.use(express.json()); // replaced a body-parser
server.use(compression());
server.use(cors());
server.use(helmet());
server.use(cookieParser());

// Routes
require('./routes').applyTo(server);

// Run server call
(async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(`💾 Connect with MongoDB on ${DB_URL} port is success!`);

    server.listen(HTTP_PORT, err => {
      if (err) throw err;
      console.log(`👍 API server running on ${HTTP_PORT} port`);
    });

    // https server
    if (!isDev) {
      const certs = getSSLCerts();
      https.createServer(certs, server).listen(HTTPS_PORT, err => {
        if (err) throw err;
        console.log(`👍 API server with SSL running on ${HTTPS_PORT} port`);
      });
    }
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();