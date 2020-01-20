const aws = require("aws-sdk");
const endpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com");
const fs = require("fs");

const s3 = new aws.S3({
  endpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

const bucketName = "rekr-profile-pics";


function rand() {
  return Math.random().toString(36).substr(2);
};

function uploadFile(stream) {
  const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: `${rand()}.png`,
        Body: stream,
        ACL: 'public-read'
      };

      s3.upload(params, options, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      });
    } catch(err) {
      reject(err)
    }
  })
}

module.exports = {
  uploadFile
}
