"use strict";

var _fetch = _interopRequireDefault(require("./fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var routes = [{
  path: "/",
  method: "get"
}, {
  path: "/status/:id",
  method: "get"
}, {
  path: "/manga-provider",
  method: "get"
}, {
  path: "/manga-list/:provider",
  method: "get"
}, {
  path: "/manga/:provider/:slug",
  method: "get"
}, {
  path: "/chapter-list/:provider/:slug",
  method: "get"
}, {
  path: "/chapter/:provider/:manga/:slug",
  method: "get"
}];
test.each(routes)("'$method' method exists on '$path'", function (route) {
  expect(_fetch["default"].stack.some(function (s) {
    return Object.keys(s.route.methods).includes(route.method);
  })).toBe(true);
  expect(_fetch["default"].stack.some(function (s) {
    return s.route.path === route.path;
  })).toBe(true);
});