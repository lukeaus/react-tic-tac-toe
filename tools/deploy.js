const s3 = require('s3');
const task = require('./task');
var secrets = require('../secrets');

module.exports = task('upload', () => Promise.resolve()
  .then(() => Uploader)
);
const Uploader = new Promise((resolve, reject) => {
  const client = s3.createClient({
  s3Options: {
      accessKeyId: secrets.accessKeyId,
      secretAccessKey: secrets.key,
      region: 'ap-southeast-2',
      sslEnabled: true,
    },
  });
  const uploader = client.uploadDir({
    localDir: 'build/',
    deleteRemoved: true,
    s3Params: {
      Bucket: secrets.bucket
    },
  });
  uploader.on('error', reject);
  uploader.on('end', resolve);
});
