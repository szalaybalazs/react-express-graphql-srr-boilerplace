const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const debug = require('debug')('boilerplace');
const expressStaticGzip = require('express-static-gzip');
const path = require('path');

// Config
require('./config')();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Static files
app.use('/static', expressStaticGzip(path.resolve(__dirname, '../static')));

// Bodyparser
app.use(bodyParser.json({ limit: '200mb' }));

// Initialize database
require('./database');

// Register GraphQL
require('./controllers').graphql(app, http);

// Router
app.use(require('./router'));

// Start server
http.listen(process.env.PORT || 5555, (err) => {
  if (err) return console.error(err);
  debug(`Starting server on port: ${process.env.PORT || 5555}`);
});
