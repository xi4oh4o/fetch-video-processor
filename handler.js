'use strict';

const fs = require('fs');
const path = require('path');
const nf = require('./src/nf');
const s3 = require('./src/s3');
const ffmpeg = require('./src/ffmpeg');

module.exports.fetch = async (event) => {

  let body = JSON.parse(event.body);

  if (typeof body.uri === 'undefined' || typeof body.videoWidth === 'undefined') {
    
    return {
      statusCode: 503,
      body: JSON.stringify({
      message: 'Request parameter exception.'
    }),
  };
  }

  async function async_task() {

    // @todo use ffprobe check uri exists
    const destPath = await nf.fetchToDestPath(body.uri);
    const finalPath = await ffmpeg.resize(destPath, body.videoWidth);
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

// Not working, waiting for debugging
module.exports.convert = async (event, context, callback) => {

  const queryString = event.queryStringParameters;

  if (!queryString) {

    return {
      statusCode: 503,
        body: JSON.stringify({
        message: 'Parameter cannot be null.'
      }),
    };
  }

  if (typeof queryString.uri === 'undefined' || typeof queryString.videoWidth === 'undefined') {
    
    return {
      statusCode: 503,
        body: JSON.stringify({
        message: 'Request parameter exception.'
      }),
    };
  }

  const destPath = await nf.fetchToDestPath(queryString.uri);
  const finalPath = await ffmpeg.resize(destPath, queryString.videoWidth);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'video/mp4'
    },
    body: new Buffer(fs.readFileSync(finalPath)).toString('base64'),
    isBase64Encoded: true
  };
};
