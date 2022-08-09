"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morganMiddleware = _interopRequireDefault(require("./middlewares/morganMiddleware"));

var _index = _interopRequireDefault(require("./routes/index"));

var _fetch = _interopRequireDefault(require("./routes/fetch"));

var _scrape = _interopRequireDefault(require("./routes/scrape"));

var _update = _interopRequireDefault(require("./routes/update"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_morganMiddleware["default"]);
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, "../public"))); // TODO Add auth for endpoint other than GET

app.use("/", _index["default"]);
app.use("/fetch", _fetch["default"]);
app.use("/scrape", _scrape["default"]);
app.use("/update", _update["default"]);
var _default = app;
exports["default"] = _default;