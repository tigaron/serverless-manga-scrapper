"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _create = _interopRequireDefault(require("./create"));

var _read = require("./read");

var _update = require("./update");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var db = {
  createEntry: _create["default"],
  updateEntry: _update.updateEntry,
  updateChapter: _update.updateChapter,
  updateContent: _update.updateContent,
  getEntry: _read.getEntry,
  getMangaList: _read.getMangaList,
  getChapterList: _read.getChapterList,
  getStatus: _read.getStatus,
  updateStatus: _update.updateStatus
};
var _default = db;
exports["default"] = _default;