const fs = require('fs');
const path = require('path');

const getSchema = () => {
  const files = [
    'general',
  ];

  return files.reduce(
    (schema, file) => schema += '\n' + fs.readFileSync(path.resolve(__dirname, `${file}.gql`), { encoding: 'utf8' }),
    '',
  );
}

module.exports = getSchema();
