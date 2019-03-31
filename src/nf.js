'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.fetchToDestPath = function(urls) {

  console.log(`Downloading urls: ${urls}`);

  return new Promise((resolve, reject) => {
    const destPath = path.join(os.tmpdir(), path.basename(urls))
    const file = fs.createWriteStream(destPath)
    file.on('close', () => resolve(destPath))
    file.on('error', reject)

    function checkStatus(res) {
        if (res.ok) { // res.status >= 200 && res.status < 300
          return res;
        } else {
          return reject(res.statusText)
        }
    }

    fetch(urls)
    .then(checkStatus)
    .then(res => {
      res.body.pipe(file);
    }).catch(err => reject(err));
  })
}
