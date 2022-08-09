"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbclient = void 0;

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

var REGION = process.env.REGION;
var dbclient = new _clientDynamodb.DynamoDBClient({
  region: REGION
});
exports.dbclient = dbclient;