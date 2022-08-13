"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function objectIsEmpty(object) {
  for (var property in object) {
    return false;
  }

  return true;
}

var _default = objectIsEmpty;
exports["default"] = _default;