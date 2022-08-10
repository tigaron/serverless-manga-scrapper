"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _convert = require("../controllers/convert");

var _validateRequest = require("../middlewares/validateRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// TODO add endpoint to convert img content to progressive and compressed version
var router = _express["default"].Router();

router.route("/chapter").put((0, _validateRequest.validateBody)("chapter"), _convert.convertImg);
var _default = router;
exports["default"] = _default;