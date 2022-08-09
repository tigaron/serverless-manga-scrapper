"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fetch = require("../controllers/fetch");

var _validateRequest = require("../middlewares/validateRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/", function (req, res) {
  return res.redirect(301, "/fetch/list");
});
router.route("/status/:id").get(_fetch.fetchStatus);
router.route("/list").get(_fetch.fetchSourceList);
router.route("/list/:source").get(_validateRequest.validateSource, (0, _fetch.fetchData)("list"));
router.route("/manga/:source/:slug").get(_validateRequest.validateSource, (0, _fetch.fetchData)("manga"));
router.route("/chapters/:source/:slug").get(_validateRequest.validateSource, (0, _fetch.fetchData)("chapters"));
router.route("/chapter/:source/:slug").get(_validateRequest.validateSource, (0, _fetch.fetchData)("chapter"));
var _default = router;
exports["default"] = _default;