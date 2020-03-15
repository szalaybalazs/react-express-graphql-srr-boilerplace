const fs = require('fs');

module.exports = fs.readdirSync(__dirname).reduce((exports, file) => {
  if (file === 'index.js') return exports;

  return { ...exports, ...require(`./${file}`) };
}, {});
