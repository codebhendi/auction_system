const bcrypt = require('bcryptjs');

const localAuth = require('./local');
const knex = require('../db/connection');

// Function to compare the password for user authentication in login
// @param userPassword: password passed by user for normal login
// @param dbPassword: encrypted password stored in database
const comparePassword = (userPassword, dbPassword) => bcrypt.compareSync(userPassword, dbPassword);

// Function to create an  user registered via email
// req: request object
const createUser = (req) => {
  // Generate salt and then encrypt password using the salt
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  const { email, fullName, address } = req.body;
  // Enter the user object to the database
  // Parameters required to insert in the database
  // local_email: Email user registered from
  // local_password: Password user used for registration
  // is_activated: Activation status for email check
  // admin: Admin status of the account
  return knex('users')
    .insert({
      email,
      address,
      full_name: fullName,
      password: hash,
      is_active: true,
    })
    .returning('*');
};

/* eslint-disable consistent-return */
// Function to check if the token passed by the request is valid
// and authorizes the request
const ensureAuthenticated = (req, res, next) => {
  // checking the headers for authorization headers
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'Please log in',
    });
  }

  // decode the token
  const header = req.headers.authorization.split(' ');
  const token = header[1];

  localAuth.decodeToken(token, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        status: 'Token has expired',
      });
    }

    // Finding the user using the data obtained from the token decoding
    return knex('users').where({ id: parseInt(payload.sub, 10) }).first()
      .then((user) => {
        if (user.is_active === false) {
          return res.status(401).json({
            status: 'error',
          });
        }

        req.user = user;
        return next();
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          status: 'error',
        });
      });
  });
};

// Function to send an user object with just the required details and not
// everything.
// @param user: user object which has to be cut down to be send to client
const sendUser = (user) => {
  const newUser = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    is_active: user.is_active,
    is_admin: user.is_admin,
    full_name: user.full_name,
    address: user.address,
  };

  return newUser;
};

/* eslint-enable consistent-return */
module.exports = {
  createUser,
  comparePassword,
  ensureAuthenticated,
  sendUser,
};
