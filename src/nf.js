'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.fetchToDestPath = function(urls) {

  return new Promise((resolve, reject) => {

    console.log(`Downloading urls: ${urls}`);
    const destPath = path.join(os.tmpdir(), path.basename(urls))
    const file = fs.createWriteStream(destPath)
    file.on('close', () => {
      resolve(destPath);
    });
    file.on('error', reject);

    function checkStatus(res) {

      if (!res.ok) {
        return reject(new Error(
          `Failed to fetch ${res.url}: ${res.status} ${res.statusText}`));
      }

      let fileType = res.headers.get('content-type');
      let fileLength = res.headers.get('content-length');

      const allowContentType = [
        'video/mp4',
        'video/x-flv'
        // @todo Should add more vidoe content type.
      ]

      if (!allowContentType.includes(fileType)) {
        return reject('File type not supported');
      }

      if (fileLength > 51200000) {
        return reject('Upload size exceeded limit');
      }

      return res;
    }

    fetch(urls)
    .then(checkStatus)
    .then(res => {
      res.body.pipe(file);
    }).catch(err => reject(err));
  })
}
