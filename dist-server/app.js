"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morganMiddleware = _interopRequireDefault(require("./middlewares/morganMiddleware.js"));

var _index = _interopRequireDefault(require("./routes/index.js"));

var _fetch = _interopRequireDefault(require("./routes/fetch.js"));

var _scrape = _interopRequireDefault(require("./routes/scrape.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_morganMiddleware["default"]);
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"]("../public")); // TODO Add auth for endpoint other than GET

app.use("/", _index["default"]);
app.use("/fetch", _fetch["default"]);
app.use("/scrape", _scrape["default"]);
var _default = app;
exports["default"] = _default;