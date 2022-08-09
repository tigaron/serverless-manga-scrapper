"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _app = _interopRequireDefault(require("../../app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe("Test fetch endpoints", function () {
  test("GET: /fetch redirects to /fetch/list", function () {
    return (0, _supertest["default"])(_app["default"]).get("/fetch").expect(301).expect("location", "/fetch/list");
  });
  test("GET: /fetch/list returns object with list of manga providers", function () {
    return (0, _supertest["default"])(_app["default"]).get("/fetch/list").expect(200, {
      statusCode: 200,
      statusText: "OK",
      data: ["alpha", "asura", "flame", "luminous", "realm"]
    });
  });
});