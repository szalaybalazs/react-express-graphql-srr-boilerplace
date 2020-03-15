const convert = require('xml-js');

const parseXml = () => {}

const convertToXml = () => {

}

const fields = [
  'uniqueId',
  'email',
  'firstName',
  'middleName',
  'lastName',
  'name',
  'birthday',
  'birthplace',
  'nationality',
  'residence',
  'phonenumber',
]

const convertUserToXml = user => {
  const content = { 
    _declaration: {
      _attributes: {
        version: '1.0',
      }
    },
    user: {
      ...fields.reduce((agg, key) => ({ ...agg, [key]: String(user[key])}), {}),
      birhday: new Date(user.birhday).toDateString(),
      _attributes: {
          type: user.type,
      }
    }
  }
  return convert.js2xml(content, { compact: true, ignoreComment: true, spaces: 4, indentCdata: true });
}

module.exports = {
  parseXml,
  convertToXml,
  convertUserToXml,
}