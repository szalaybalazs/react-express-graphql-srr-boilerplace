const Router = require('express').Router();
const passport = require('passport');
const debug = require('debug')('beam');
const { hashPassword } = require('../common/password');

const { User } = require('../database');

// Login
Router.post('/login', (req, res, next) => {
  if (req.user) return res.json({ success: true, user: req.user });

  return passport.authenticate('local', (err, user, info) => {
    if (err) return console.log(err);
    if (!user || !(user.superadmin || user.school.equals(req.body.school))) return res.status(401).json({ error: true, message: 'Incorrect password or e-mail address', });
    
    if (user.passwordChangeRequired) return res.json({ succes: true, user });

    req.logIn(user, (_err) => {
      if (_err) return console.log(_err);

      debug(`User successfully logged in: ${user.email}`);

      user.lastLogin = new Date();
      user.save();

      console.log(req.session.cookie)
      // Setting cookie domain
      req.session.cookie.domain = req.get('host');

      if (!req.body.remember) {
        req.session.cookie.maxAge = null;
        req.session.cookie.expires = false;
      }


      if (req.query.token !== undefined) return res.json({ success: true, token  });
      return res.json({ success: true, user });
    });
  })(req, res, next);
});

// Signup
Router.post('/signup', async (req, res, next) => {
  if (!req.body) return res.json({ error: true, message: 'INTERNAL_SERVER_ERROR', code: 'ISE:001' });
  if (req.user) return res.status(400).json({ success: true, user: req.user, message: 'You\'re already logged in.' });
  if (!req.body.email && !req.body.password) return res.status(400).json({ error: true, message: '👊🏿' });

  const alreadyUser = await User.findOne({ email: req.body.email }, { _id: true });
  if (alreadyUser) return res.status(400).json({ error: true, message: 'ALREADY_IN_USE' });
  
  
  const user = await User.create(req.body);
  req.logIn(user, async (_err) => {
    if (_err) return console.log(_err);
    debug(`User successfully registered: ${user.email}`);
    return res.json({ success: true, user: user });
  });
});

// Logout
Router.use('/logout', (req, res) => {
  if (!req.user) return res.status(400).json({ error: true, message: 'You\'re not authorized. ' });

  req.logout();

  if (req.xhr) res.json({ success: true });
  else res.redirect('/');
});

// Reset
Router.use('/reset', async (req, res) => {
  const { password, token } = req.body;

  const user = await User.findOne({ passwordToken: token });

  if (!user) return res.json({ error: true, message: 'Token not valid' });

  req.logIn(user, async (_err) => {
    if (_err) return console.log(_err);
    user.password = await hashPassword(password);
    user.passwordToken = null;
    user.passwordChangeRequired = false;
    user.lastLogin = new Date();
    await user.save();
    
    debug(`User successfully logged in: ${user.email}`);

    res.json({ success: true, user });
  })
});

module.exports = Router;
