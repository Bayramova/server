/* eslint-disable no-buffer-constructor */
/* eslint-disable consistent-return */
const AWS = require("aws-sdk");

AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "us-east-2"
});
const s3 = new AWS.S3();

module.exports = async (key, image, res) => {
  try {
    const params = {
      Bucket: "cleaning-services-images-storage",
      Key: key,
      Body: new Buffer(image, "base64")
    };
    const data = await s3.upload(params).promise();
    if (data) {
      return data.Location;
    }
  } catch (err) {
    return res
      .status(422)
      .json({ message: "Upload error", details: err.message });
  }
};
