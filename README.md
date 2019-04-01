fetch-video-processor
=====================

fetch-video-processor is a Serverless HTTP event functions.
This can fetch video by URI and through FFmpeg processing, final stored in the AWS S3.

 Notice
============
### This is an uncompleted example project, For reference only.

Deploy in local
===============
```bash
npm install
sls offline start
```

Deploy in Lambda
=================
```bash
npm install
npm install --save @ffmpeg-installer/ffmpeg --force
serverless deploy
```
![Deploy in lambda](http://wx4.sinaimg.cn/large/6209f836ly1g1n6dg1zjej20t30nagqj.jpg)

Example
===============
Fetch Video by URI and Processing Scale, final stored in AWS S3

The videoWidth parameter use for scales video to specify the width
```bash
curl -X POST \
  http://localhost:3000/fetch \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
  "uri": "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_30mb.mp4",
  "videoWidth": 480
}'
```
You can open s3-local http://localhost:4567/local-bucket check Processed file

[![asciicast](https://asciinema.org/a/238009.svg)](https://asciinema.org/a/238009)

Better way
===============
AWS Lambda has a number of limitations, it is suitable for simple logical processing Like image watermarks or message notifications etc, and pay as you meter.

* Use AWS S3 for uploads and downloads resources
* Handle the resources in AWS S3 through the lambda trigger instead of HTTP event
* Huge videos should use Amazon Elastic Transcoder

Todo
=========
- [X] Request ffmpeg parameters Support
- [ ] Amazon Elastic Transcoder Support
- [ ] Access authorization Support