"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _morgan = _interopRequireDefault(require("morgan"));

var _logger = _interopRequireDefault(require("../services/logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var stream = {
  write: function write(message) {
    return _logger["default"].http(message.trim());
  }
};

var skip = function skip() {
  var env = process.env.NODE_ENV || "development";
  return env !== "development";
};

var morganMiddleware = (0, _morgan["default"])(":method :url :status :res[content-length] - :response-time ms", {
  stream: stream,
  skip: skip
});
var _default = morganMiddleware;
exports["default"] = _default;