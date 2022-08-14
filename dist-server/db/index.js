"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _create = require("./create");

var _read = require("./read");

var _update = require("./update");

var db = {
  createEntry: _create.createEntry,
  createStatus: _create.createStatus,
  getEntry: _read.getEntry,
  getCollection: _read.getCollection,
  updateMangaEntry: _update.updateMangaEntry,
  updateChapterEntry: _update.updateChapterEntry,
  updateStatus: _update.updateStatus
};
var _default = db;
exports["default"] = _default;