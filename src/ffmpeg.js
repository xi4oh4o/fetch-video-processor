'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


exports.resize = function(file_path) {
    console.log(`Processing file: ${file_path}`);
  
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(file_path);
        input.pipe(hash);
        const destPath = path.join(os.tmpdir() ,hash.digest('hex')+path.basename(file_path))
        
        ffmpeg(file_path)
        .size('480x?')
        .output(destPath)
        .on('error', reject)
        .on('end', () => resolve(destPath))
        .run();
    })
  }