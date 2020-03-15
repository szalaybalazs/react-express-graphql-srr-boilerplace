const fs = require('fs');

// Dynamically exporting everything in the directory
module.exports = fs.readdirSync(__dirname).reduce((exports, file) => {
  if (file === 'index.js') return exports;

  exports[file.slice(0, -3)] = require(`./${file}`);

  return exports;
}, {});