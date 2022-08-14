"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _create = require("./create.js");

var _read = require("./read.js");

var _update = require("./update.js");

var db = {
  createStatus: _create.createStatus,
  createEntry: _create.createEntry,
  getEntry: _read.getEntry,
  updateMangaEntry: _update.updateMangaEntry,
  updateChapterEntry: _update.updateChapterEntry,
  updateStatus: _update.updateStatus
};
var _default = db;
exports["default"] = _default;