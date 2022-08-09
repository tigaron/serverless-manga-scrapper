"use strict";

var _validateRequest = require("../../middlewares/validateRequest.js");

var _express = require("@jest-mock/express");

describe("Test validateSource validation middleware", function () {
  test("Validation success --> call next()", function () {
    var req = (0, _express.getMockReq)({
      params: {
        source: "asura"
      }
    });

    var _getMockRes = (0, _express.getMockRes)(),
        res = _getMockRes.res,
        next = _getMockRes.next;

    (0, _validateRequest.validateSource)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("Validation fail --> return 404", function () {
    var req = (0, _express.getMockReq)({
      params: {
        source: "ana"
      }
    });

    var _getMockRes2 = (0, _express.getMockRes)(),
        res = _getMockRes2.res,
        next = _getMockRes2.next;

    (0, _validateRequest.validateSource)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 404,
      statusText: "Unknown source: '".concat(req.params.source, "'")
    });
  });
});
describe("Test checkBody validation middleware", function () {
  test("Validation success --> call next()", function () {
    var type = "manga";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        source: "asura",
        slug: "manga+worthless-regression"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    var _getMockRes3 = (0, _express.getMockRes)(),
        res = _getMockRes3.res,
        next = _getMockRes3.next;

    (0, _validateRequest.validateBody)(type)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("Invalid header's content-type --> return 406", function () {
    var type = "list";
    var req = (0, _express.getMockReq)();

    var _getMockRes4 = (0, _express.getMockRes)(),
        res = _getMockRes4.res,
        next = _getMockRes4.next;

    (0, _validateRequest.validateBody)(type)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 406,
      statusText: "Content is not acceptable"
    });
  });
  test("Invalid body's source --> return 400", function () {
    var type = "list";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        source: "ana"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    var _getMockRes5 = (0, _express.getMockRes)(),
        res = _getMockRes5.res,
        next = _getMockRes5.next;

    (0, _validateRequest.validateBody)(type)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      statusText: "Unknown source: '".concat(req.body.source, "'")
    });
  });
  test("Invalid body's slug --> return 400", function () {
    var type = "manga";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        source: "asura"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    var _getMockRes6 = (0, _express.getMockRes)(),
        res = _getMockRes6.res,
        next = _getMockRes6.next;

    (0, _validateRequest.validateBody)(type)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 400,
      statusText: "'slug' is empty"
    });
  });
});