"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

var level = function level() {
  var env = process.env.NODE_ENV || "development";
  var isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

var colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white"
};

_winston["default"].addColors(colors);

var format = _winston["default"].format.combine(_winston["default"].format.timestamp({
  format: "YYYY-MM-DD HH:mm:ss:ms"
}), _winston["default"].format.colorize({
  all: true
}), _winston["default"].format.printf(function (info) {
  return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message);
}));

var transports = [new _winston["default"].transports.Console(), new _winston["default"].transports.File({
  filename: "logs/error.log",
  level: "error"
}), new _winston["default"].transports.File({
  filename: "logs/all.log"
})];

var logger = _winston["default"].createLogger({
  level: level(),
  levels: levels,
  format: format,
  transports: transports
});

var _default = logger;
exports["default"] = _default;