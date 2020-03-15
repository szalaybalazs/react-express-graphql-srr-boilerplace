const fs = require('fs');

module.exports = fs.readdirSync(__dirname).reduce((exports, file) => {
  if (file === 'index.js') return exports;

  exports[file.slice(0, -3)] = require(`./${file}`);

  return exports;
}, {});