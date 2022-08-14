"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _scrape = _interopRequireDefault(require("../controllers/scrape"));

var _validations = _interopRequireDefault(require("../validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.route("/manga-list").post(_validations["default"].body("Provider"), _scrape["default"].mangaList);
router.route("/manga").post(_validations["default"].body("ProviderSlug"), _scrape["default"].manga);
router.route("/chapter-list").post(_validations["default"].body("ProviderSlug"), _scrape["default"].chapterList);
router.route("/chapter").post(_validations["default"].body("ProviderMangaSlug"), _scrape["default"].chapter);
var _default = router;
exports["default"] = _default;