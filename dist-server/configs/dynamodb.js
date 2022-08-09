"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamodb = void 0;

var _libDynamodb = require("@aws-sdk/lib-dynamodb");

var _dbclient = require("./dbclient");

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

var dynamodb = _libDynamodb.DynamoDBDocumentClient.from(_dbclient.dbclient, translateConfig);

exports.dynamodb = dynamodb;