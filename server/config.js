const AWS = require('aws-sdk');

const config = {
  region: 'eu-central-1',
  accessKeyId: 'AKIAJBL7BG5NTPRQLSAQ',
  secretAccessKey: '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',
};

module.exports = () => AWS.config.update(config);

module.exports.config = config;
