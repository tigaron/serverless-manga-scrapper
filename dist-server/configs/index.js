"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

var _libDynamodb = require("@aws-sdk/lib-dynamodb");

var REGION = process.env.REGION;
var dynamodb = new _clientDynamodb.DynamoDBClient({
  region: REGION
});
var marshallOptions = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
};
var unmarshallOptions = {
  wrapNumbers: false
};
var translateConfig = {
  marshallOptions: marshallOptions,
  unmarshallOptions: unmarshallOptions
};

var dbclient = _libDynamodb.DynamoDBDocumentClient.from(dynamodb, translateConfig);

var _default = dbclient;
exports["default"] = _default;