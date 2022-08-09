"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _update = require("../controllers/update");

var _validateRequest = require("../middlewares/validateRequest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.route("/list").put((0, _validateRequest.validateBody)("list"), (0, _update.updateData)("list"));
router.route("/manga").put((0, _validateRequest.validateBody)("manga"), (0, _update.updateData)("manga"));
router.route("/chapter").put((0, _validateRequest.validateBody)("chapter"), (0, _update.updateData)("chapter"));
var _default = router;
exports["default"] = _default;