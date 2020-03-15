const stream = require('stream');
const contentDisposition = require('content-disposition');
const streamToBuffer = require('stream-to-buffer')
const { Attachment } = require('../database')

const s3 = require('./s3');

module.exports = (file, group, pipe = async buffer => buffer) => new Promise(async (res, rej) => {
  const { createReadStream, filename, mimetype, encoding } = await file;
  const _ = await file;
  console.log(Object.keys(_))
  const stream = createReadStream();
  const bufs = [];

  streamToBuffer(stream, async (err, buffer) =>  {
    const attachment = await Attachment.create({ name: filename, group, mime: mimetype, size: buffer.byteLength });

    const key = group + (group && '/') + attachment._id.toString();

    var params = { 
      Bucket: process.env.S3_BUCKET_NAME, 
      Key: key, 
      Body: await pipe(buffer, filename), 
      ACL: 'public-read', 
      ContentDisposition: contentDisposition(filename),
    };

    s3.upload(params, (err, data) => {
      if (err) console.log(err)
      res({ attachment, file: { filename, mimetype, encoding }})
    });
  })
});