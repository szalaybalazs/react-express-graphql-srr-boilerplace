const passport = require('passport');
const Router = require('express').Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const subdomain = require('express-subdomain');

const setUpAuthentication = require('./authentication');

const { root, authentication } = require('./controllers');

const api = require('./api');

Router.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, '..', 'config', 'robots.txt')));


// Set up passport and express
setUpAuthentication(Router, passport);
Router.use('/auth', cors(), authentication);

// API
Router.use('/api', cors(), api);

// Root
Router.use('/', root);


module.exports = Router;
