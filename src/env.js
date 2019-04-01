'use strict';

exports.getBucketEndPoint = function() {

    return process.env.BUCKET_ENDPOINT;
}

exports.getBucketName = function() {

    return process.env.BUCKET_NAME;
}