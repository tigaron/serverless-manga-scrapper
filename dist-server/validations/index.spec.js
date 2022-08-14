"use strict";

var _validations = _interopRequireDefault(require("../validations"));

var _express = require("@jest-mock/express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _getMockRes = (0, _express.getMockRes)(),
    res = _getMockRes.res,
    next = _getMockRes.next,
    clearMockRes = _getMockRes.clearMockRes;

beforeEach(function () {
  clearMockRes();
  jest.clearAllMocks();
});
describe("validate.uuid behaviour", function () {
  test("Validation success --> call next()", function () {
    var req = (0, _express.getMockReq)({
      params: {
        id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5"
      }
    });

    _validations["default"].uuid(req, res, next);

    expect(next).toHaveBeenCalled();
  });
  test("Validation fail --> return 400", function () {
    var req = (0, _express.getMockReq)({
      params: {
        id: "hello"
      }
    });

    _validations["default"].uuid(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      statusText: expect.any(String)
    });
  });
});
describe("validate.provider behaviour", function () {
  test("Validation success --> call next()", function () {
    var req = (0, _express.getMockReq)({
      params: {
        provider: "asura"
      }
    });

    _validations["default"].provider(req, res, next);

    expect(next).toHaveBeenCalled();
  });
  test("Validation fail --> return 404", function () {
    var req = (0, _express.getMockReq)({
      params: {
        provider: "hello"
      }
    });

    _validations["default"].provider(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      statusText: expect.any(String)
    });
  });
});
describe("validate.body behaviour", function () {
  test("Provider validation success --> call next()", function () {
    var items = "Provider";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "asura"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
  test("Provider validation fail: not provided --> return 400", function () {
    var items = "Provider";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      statusText: expect.any(String)
    });
  });
  test("Provider validation fail: invalid --> return 404", function () {
    var items = "Provider";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "hello"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      statusText: expect.any(String)
    });
  });
  test("ProviderSlug validation success --> call next()", function () {
    var items = "ProviderSlug";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "asura",
        slug: "damn-reincarnation"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
  test("ProviderSlug validation fail --> return 400", function () {
    var items = "ProviderSlug";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "asura"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      statusText: expect.any(String)
    });
  });
  test("ProviderMangaSlug validation success --> call next()", function () {
    var items = "ProviderMangaSlug";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "asura",
        manga: "damn-reincarnation",
        slug: "damn-reincarnation-chapter-1"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
  test("ProviderMangaSlug validation fail --> return 400", function () {
    var items = "ProviderMangaSlug";
    var req = (0, _express.getMockReq)({
      headers: {
        "content-type": "application/json"
      },
      body: {
        provider: "asura",
        slug: "damn-reincarnation-chapter-1"
      },
      is: function is() {
        return req.headers["content-type"] === "application/json";
      }
    });

    _validations["default"].body(items)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      statusText: expect.any(String)
    });
  });
  test("Invalid header's content-type --> return 406", function () {
    var items = "Provider";
    var req = (0, _express.getMockReq)();

    _validations["default"].body(items)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(406);
    expect(res.json).toHaveBeenCalledWith({
      status: 406,
      statusText: expect.any(String)
    });
  });
});