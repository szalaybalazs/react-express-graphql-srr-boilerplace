const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);

const { User } = require('./database');

const { verifyPassword } = require('./common/password');

module.exports = (Router, passport) => {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Get User by EMAIL index
      const user = await User.findOne({ email });

      // There was no user found with given email
      if (!user) return done(null, false);
      // Password not correct
      else if (!await verifyPassword(password, user.password)) return done(null, false);
      // Everything is fine, here you go
      else return done(null, user);
    },
  ));

  // Serialize user session with id
  passport.serializeUser((user, done) => done(null, user.id));
  // Get user by ID
  passport.deserializeUser((id, done) =>  User.findById(id).then(user => done(null, user)));

  const remoteUsers = [];

  // Express settings
  Router.use(cookieParser());
  Router.use(session({
    secret: process.env.SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, domain: process.env.DOMAIN || '.elisa.hu' },
    store: new MongoDBStore({
      uri: process.env.DB_URI,
    }),
  }));
  Router.use(passport.initialize());
  Router.use(passport.session());
};
