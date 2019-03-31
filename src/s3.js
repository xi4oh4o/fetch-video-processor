'use strict';

const AWS = require('aws-sdk');
const env = require('../src/env');

exports.upload = function(Bucket, Key, Body) {
    
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3({
        s3ForcePathStyle: true,
        endpoint: new AWS.Endpoint(env.getBucketEndPoint()),
      });

      return s3.putObject({
        Bucket, Key, Body
      }).on('httpUploadProgress', ({loaded, total}) => {
        console.log(`Uploading ${Key} to ${Bucket}: (${Math.round(100 * loaded / total)}%) ${loaded} / ${total}`)
      }).promise()
    })
  }