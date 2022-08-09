"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _scrape = require("../controllers/scrape");

var _validateRequest = require("../middlewares/validateRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.route("/list").post((0, _validateRequest.validateBody)("list"), (0, _scrape.scrapeData)("list"));
router.route("/manga").post((0, _validateRequest.validateBody)("manga"), (0, _scrape.scrapeData)("manga"));
router.route("/chapter").post((0, _validateRequest.validateBody)("chapter"), (0, _scrape.scrapeData)("chapter"));
var _default = router;
exports["default"] = _default;