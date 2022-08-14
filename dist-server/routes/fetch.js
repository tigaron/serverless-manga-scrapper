"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _fetch = require("../controllers/fetch.js");

var _index = require("../validations/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/", function (req, res) {
  return res.redirect(301, "/fetch/list");
});
router.route("/status/:id").get(_index.validateUUID, _fetch.fetchStatus);
router.route("/manga-provider").get(_fetch.fetchProviderList);
router.route("/manga-list/:provider").get(_index.validateProvider, (0, _fetch.fetchMangaData)("MangaList"));
router.route("/manga/:provider/:slug").get(_index.validateProvider, (0, _fetch.fetchMangaData)("Manga"));
router.route("/chapter-list/:provider/:slug").get(_index.validateProvider, (0, _fetch.fetchMangaData)("ChapterList"));
router.route("/chapter/:provider/:slug").get(_index.validateProvider, (0, _fetch.fetchMangaData)("Chapter"));
var _default = router;
exports["default"] = _default;