"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fetch = _interopRequireDefault(require("../controllers/fetch"));

var _validations = _interopRequireDefault(require("../validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/", function (req, res) {
  return res.redirect(301, "/fetch/manga-provider");
});
router.route("/status/:id").get(_validations["default"].uuid, _fetch["default"].status);
router.route("/manga-provider").get(_fetch["default"].providerData);
router.route("/manga-list/:provider").get(_validations["default"].provider, _fetch["default"].listData);
router.route("/manga/:provider/:slug").get(_validations["default"].provider, _fetch["default"].mangaData);
router.route("/chapter-list/:provider/:slug").get(_validations["default"].provider, _fetch["default"].listData);
router.route("/chapter/:provider/:manga/:slug").get(_validations["default"].provider, _fetch["default"].chapterData);
var _default = router;
exports["default"] = _default;