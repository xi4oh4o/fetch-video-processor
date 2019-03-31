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

    fetch(urls)
    .then(res => {
        res.body.pipe(file);
    });
  })
}