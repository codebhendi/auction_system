const express = require('express');

const localAuth = require('../auth/local');
const knex = require('../db/connection');
const authHelpers = require('../auth/_helpers');

const router = express.Router();

// Route to register user
router.post('/register', (req, res) => {
  // Obtain username and password from the request
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(200).json({
      message: 'Invalid email or password',
    });
  }

  // Search if an user already exists with this username or not
  return knex('users').where({ email }).first()
    .then((user) => {
      if (user) {
        return res.status(200).json({
          message: 'An user with this email already exists',
        });
      }

      // creating user with the infomation provided from front
      return authHelpers.createUser(req, res)
        .then((users) => {
          const newUser = users[0];
          // if no user created return 500
          if (!newUser) {
            return res.status(500).json('something');
          }

          return res.status(200).json({});
        });
    })
    .catch((error) => {
      // log the error and send the error
      console.log(error, 'erro1r');
      return res.status(500).json('error');
    });
});

// Router for logging in to the app.
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find if first a user with this email exists
  knex('users').where({ email }).first()
    .then((user) => {
      // If an user with username exists then match the password
      if (user && authHelpers.comparePassword(password, user.password)
        && user.is_active === true) {
        // if passed the check respond with token and user data
        const token = localAuth.encodeToken(user);
        const userToSend = authHelpers.sendUser(user);
        return res.status(200).json({
          status: 'success',
          token,
          user: userToSend,
        });
      }
      // If no user is found or failed password check then respond with an error
      return res.status(401).json({
        status: 'error',
        messages: 'incorrect password or username',
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong',
      });
    });
});

router.get('/user/get/all', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user || !user.is_admin) return res.status(401).json({ message: 'unauthorized' });

  return knex('users')
    .select('id', 'email', 'full_name', 'created_at')
    .orderBy('id')
    .then(data => res.status(200).json({ message: data }))
    .catch(err => console.log(err) || res.status(500).json({ err }));
});

router.get('/user/get/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user || !user.is_admin) return res.status(401).json({ message: 'unauthorized' });

  const { id } = req.params;

  return knex('users')
    .select('id', 'email', 'full_name', 'is_admin', 'is_active', 'address')
    .where({ id })
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({ err }));
});

router.post('/user/save/:id', authHelpers.ensureAuthenticated, (req, res) => {
  const { user } = req;

  if (!user || !user.is_admin) return res.status(401).json({ message: 'unauthorized' });

  const { id } = req.params;
  const {
    address, active, admin, fullName, email,
  } = req.body;

  return knex('users')
    .update({
      email, is_active: active, is_admin: admin, full_name: fullName, address,
    })
    .where({ id })
    .then(data => res.status(200).json({ message: data[0] }))
    .catch(err => console.log(err) || res.status(500).json({ err }));
});

// Route to authorize user from server and then user data.
// Middeware for user authorization
// @param req: request object
// @param res: response object
router.get('/user/data', authHelpers.ensureAuthenticated, (req, res) => {
  const user = authHelpers.sendUser(req.user);

  if (!req.user) {
    res.status(401).json({ message: 'unauthorized', staus: 'error' });
  } else {
    res.status(200).json({
      status: 'success',
      user,
    });
  }
});

module.exports = router;
