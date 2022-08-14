"use strict";

var _scrape = _interopRequireDefault(require("./scrape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = [{
  path: "/manga-list",
  method: "post"
}, {
  path: "/manga",
  method: "post"
}, {
  path: "/chapter-list",
  method: "post"
}, {
  path: "/chapter",
  method: "post"
}];
test.each(routes)("'$method' method exists on '$path'", function (route) {
  expect(_scrape["default"].stack.some(function (s) {
    return Object.keys(s.route.methods).includes(route.method);
  })).toBe(true);
  expect(_scrape["default"].stack.some(function (s) {
    return s.route.path === route.path;
  })).toBe(true);
});