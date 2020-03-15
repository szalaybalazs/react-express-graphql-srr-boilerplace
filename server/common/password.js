const bcrypt = require('bcrypt');

const saltRounds = process.env.SALT_ROUNDS || 10;

module.exports = {
  hashPassword: password => bcrypt.hash(password, saltRounds),
  verifyPassword: (input, actual) => bcrypt.compare(input, actual),
};
