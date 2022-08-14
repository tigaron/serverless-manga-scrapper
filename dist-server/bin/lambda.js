"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _serverlessHttp = _interopRequireDefault(require("serverless-http"));

var _app = _interopRequireDefault(require("../app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handler = (0, _serverlessHttp["default"])(_app["default"]);
exports.handler = handler;