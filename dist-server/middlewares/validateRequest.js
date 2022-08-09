"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSource = exports.validateBody = void 0;

var _provider = require("../utils/provider");

var validateSource = function validateSource(req, res, next) {
  var source = req.params.source;

  if (!_provider.sourceList.has(source)) {
    return res.status(404).json({
      statusCode: 404,
      statusText: "Unknown source: '".concat(source, "'")
    });
  }

  next();
};

exports.validateSource = validateSource;

var validateBody = function validateBody(type) {
  return function (req, res, next) {
    if (!req.is("json")) return res.status(406).json({
      statusCode: 406,
      statusText: "Content is not acceptable"
    });
    var _req$body = req.body,
        source = _req$body.source,
        slug = _req$body.slug;
    if (!_provider.sourceList.has(source)) return res.status(400).json({
      statusCode: 400,
      statusText: "Unknown source: '".concat(source, "'")
    });
    if (type !== "list" && !slug) return res.status(400).json({
      statusCode: 400,
      statusText: "'slug' is empty"
    });
    next();
  };
};

exports.validateBody = validateBody;