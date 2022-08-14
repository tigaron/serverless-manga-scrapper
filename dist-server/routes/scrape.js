"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _scrape = require("../controllers/scrape");

var _validations = require("../validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.route("/manga-list").post((0, _validations.validateBody)("Provider"), _scrape.scrapeMangaList);
router.route("/manga").post((0, _validations.validateBody)("ProviderSlug"), _scrape.scrapeManga);
router.route("/chapter-list").post((0, _validations.validateBody)("ProviderSlug"), _scrape.scrapeChapterList);
router.route("/chapter").post((0, _validations.validateBody)("ProviderMangaSlug"), _scrape.scrapeChapter);
var _default = router;
exports["default"] = _default;