'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


exports.resize = function(filePath, videoWidth) {
    console.log(`Processing file: ${filePath}`);
  
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(filePath);
        input.pipe(hash);
        const destPath = path.join(os.tmpdir() ,hash.digest('hex')+path.basename(filePath))
        
        ffmpeg(filePath)
        .size(videoWidth+'x?')
        .output(destPath)
        .on('error', reject)
        .on('end', () => resolve(destPath))
        .run();
    })
  }