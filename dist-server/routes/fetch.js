"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fetch = require("../controllers/fetch");

var _validations = require("../validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/", function (req, res) {
  return res.redirect(301, "/fetch/list");
});
router.route("/status/:id").get(_validations.validateUUID, _fetch.fetchStatus);
router.route("/manga-provider").get(_fetch.fetchProviderList);
router.route("/manga-list/:provider").get(_validations.validateProvider, _fetch.fetchListData);
router.route("/manga/:provider/:slug").get(_validations.validateProvider, _fetch.fetchMangaData);
router.route("/chapter-list/:provider/:slug").get(_validations.validateProvider, _fetch.fetchListData);
router.route("/chapter/:provider/:manga/:slug").get(_validations.validateProvider, _fetch.fetchChapterData);
var _default = router;
exports["default"] = _default;