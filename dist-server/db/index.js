"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _create = require("./create");

var _read = require("./read");

var _update = require("./update");

var db = {
  createStatus: _create.createStatus,
  createEntry: _create.createEntry,
  getEntry: _read.getEntry,
  getMangaListElement: _read.getMangaListElement,
  getChapterListElement: _read.getChapterListElement,
  updateMangaListElement: _update.updateMangaListElement,
  updateChapterListElement: _update.updateChapterListElement,
  updateStatus: _update.updateStatus
};
var _default = db;
exports["default"] = _default;