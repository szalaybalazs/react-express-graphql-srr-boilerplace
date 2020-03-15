const { getTranslation } = require('./translation');

module.exports = {
  generateKey: ({ _id, name }, language) => String(_id).slice(0, 6) + '-' + String(getTranslation(name, language)).toLowerCase().replace(/ /g, '-'),
}