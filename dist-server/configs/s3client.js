"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clientS = require("@aws-sdk/client-s3");

var REGION = process.env.REGION;
var s3client = new _clientS.S3Client({
  region: REGION
});
var _default = s3client;
exports["default"] = _default;