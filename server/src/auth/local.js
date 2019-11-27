const moment = require('moment');
const jwt = require('jwt-simple');

// Mehtod used to encode token so it can not
// be manipulated
function encodeToken(user) {
  const playload = {
    exp: moment().add(30, 'days').unix(),
    iat: moment().unix(),
    sub: user.id,
  };
  return jwt.encode(playload, process.env.TOKEN_SECRET || 'my_secret');
}

// Method to decode token to authorize users
function decodeToken(token, callback) {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET || 'my_secret');
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

module.exports = {
  encodeToken,
  decodeToken,
};
