'use strict';

const fs = require('fs');
const path = require('path');
const nf = require('./src/nf');
const s3 = require('./src/s3');
const ffmpeg = require('./src/ffmpeg');

module.exports.fetch = async (event) => {

  let body = JSON.parse(event.body);

  async function async_task() {

    // @todo use ffprobe check uri exists
    const destPath = await nf.fetchToDestPath(body.uri);
    const finalPath = await ffmpeg.resize(destPath);
    return await s3.upload('local-bucket', path.basename(finalPath), fs.createReadStream(finalPath));
  }

  async_task()
    .then(data => {
      console.log(data)
    }).catch(err => console.log(err));

  return {
      statusCode: 200,
      body: JSON.stringify({
      message: 'Video file add processor task queued successed!'
    }),
  };
};
