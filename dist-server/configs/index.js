"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dbclient", {
  enumerable: true,
  get: function get() {
    return _dbclient["default"];
  }
});
Object.defineProperty(exports, "s3client", {
  enumerable: true,
  get: function get() {
    return _s3client["default"];
  }
});

var _s3client = _interopRequireDefault(require("./s3client"));

var _dbclient = _interopRequireDefault(require("./dbclient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }