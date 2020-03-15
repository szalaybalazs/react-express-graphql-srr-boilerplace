const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const fs = require('fs');
const path = require('path');

// Dynamically exporting everything in the directory
module.exports = fs.readdirSync(path.join(__dirname, 'models')).reduce((exports, file) => {
  if (file === 'index.js') return exports;

  const model = require(`./models/${file}`);
  if (typeof(model) !== 'function') return exports;

  exports[file.slice(0, -3)] = model(mongoose);

  return exports;
}, {});
