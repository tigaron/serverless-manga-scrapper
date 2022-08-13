"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrapeChapter = scrapeChapter;
exports.scrapeChapterList = scrapeChapterList;
exports.scrapeManga = scrapeManga;
exports.scrapeMangaList = scrapeMangaList;

var _uuid = require("uuid");

var _scraper = _interopRequireDefault(require("../services/scraper"));

var _logger = _interopRequireDefault(require("../services/logger"));

var _utils = _interopRequireDefault(require("../utils"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

/*
Function to scrape manga list from a specific manga provider
Example:
path: /scrape/manga-list
body: { provider: "asura" }
*/
function scrapeMangaList(_x, _x2) {
  return _scrapeMangaList.apply(this, arguments);
}
/*
Function to scrape a specific manga from a specific provider
Example:
path: /scrape/manga
body: { provider: "asura", type: "comics", slug: "damn-reincarnation" }
*/


function _scrapeMangaList() {
  _scrapeMangaList = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var MangaProvider, urlString, jsonResponse, response, data, requestId, requestStatus, failedItems, mapIterator, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, element, item, result, updatedStatus;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            MangaProvider = req.body.provider;
            urlString = "".concat(Object.values(_utils["default"].get(MangaProvider)).join("/"), "/list-mode/");
            _context.prev = 2;
            _context.next = 5;
            return (0, _scraper["default"])(urlString, "MangaList", MangaProvider);

          case 5:
            response = _context.sent;

            if (!(response.constructor === Error)) {
              _context.next = 9;
              break;
            }

            jsonResponse = new Map([["status", response.cause], ["statusText", response.message]]);
            return _context.abrupt("return", res.status(response.cause).json(Object.fromEntries(jsonResponse)));

          case 9:
            _context.next = 11;
            return _db["default"].getEntry(response.get("Id"));

          case 11:
            data = _context.sent;

            if (data) {
              _context.next = 17;
              break;
            }

            _context.next = 15;
            return _db["default"].createEntry(Object.fromEntries(response));

          case 15:
            jsonResponse = new Map([["status", 201], ["statusText", "Created"], ["data", Object.fromEntries(jsonResponse)]]);
            return _context.abrupt("return", res.status(201).json(Object.fromEntries(jsonResponse)));

          case 17:
            /*
            If already exist in the database
            Give 202 response before processing scraped data
            Inform the requestId, so it can be checked later on
            */
            requestId = (0, _uuid.v4)();
            requestStatus = new Map([["Id", requestId], ["RequestType", "manga-list_".concat(MangaProvider)], ["RequestStatus", "pending"]]);
            _context.next = 21;
            return _db["default"].createStatus(Object.fromEntries(requestStatus));

          case 21:
            jsonResponse = new Map([["status", 202], ["statusText", "Processing request..."], ["data", {
              requestId: requestId,
              requestType: "manga-list_".concat(MangaProvider)
            }]]);
            res.status(202).json(Object.fromEntries(jsonResponse));
            /*
            Add each element of scraped manga list to database
            Skip if already exist in the database
            */

            failedItems = new Set();
            mapIterator = response.get("MangaList")[Symbol.iterator]();
            _iteratorAbruptCompletion = false;
            _didIteratorError = false;
            _context.prev = 27;
            _iterator = _asyncIterator(mapIterator);

          case 29:
            _context.next = 31;
            return _iterator.next();

          case 31:
            if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
              _context.next = 50;
              break;
            }

            element = _step.value;
            item = new Map([["Id", response.get("Id")], ["MangaSlug", element[0]]]);
            _context.next = 36;
            return _db["default"].getMangaListElement(Object.fromEntries(item));

          case 36:
            result = _context.sent;
            console.log(result);

            if (!result) {
              _context.next = 43;
              break;
            }

            failedItems.add("Already exist in the database: '".concat(item.get("MangaSlug"), "'"));
            return _context.abrupt("continue", 47);

          case 43:
            item.set("UpdatedAt", response.get("UpdatedAt"));
            item.set("MangaDetail", Object.fromEntries(element[1]));
            _context.next = 47;
            return _db["default"].updateMangaListElement(Object.fromEntries(item));

          case 47:
            _iteratorAbruptCompletion = false;
            _context.next = 29;
            break;

          case 50:
            _context.next = 56;
            break;

          case 52:
            _context.prev = 52;
            _context.t0 = _context["catch"](27);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 56:
            _context.prev = 56;
            _context.prev = 57;

            if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
              _context.next = 61;
              break;
            }

            _context.next = 61;
            return _iterator["return"]();

          case 61:
            _context.prev = 61;

            if (!_didIteratorError) {
              _context.next = 64;
              break;
            }

            throw _iteratorError;

          case 64:
            return _context.finish(61);

          case 65:
            return _context.finish(56);

          case 66:
            /*
            Update request status in the database
            Add information of skipped item if any
            */
            updatedStatus = new Map([["Id", requestId], ["RequestStatus", "completed"], ["FailedItems", failedItems.size ? Array.from(failedItems) : []]]);
            _context.next = 69;
            return _db["default"].updateStatus(Object.fromEntries(updatedStatus));

          case 69:
            _context.next = 77;
            break;

          case 71:
            _context.prev = 71;
            _context.t1 = _context["catch"](2);

            _logger["default"].error(_context.t1.message);

            _logger["default"].error(_context.t1.stack);

            jsonResponse = new Map([["status", 500], ["statusText", _context.t1.message]]);
            return _context.abrupt("return", res.status(500).json(Object.fromEntries(jsonResponse)));

          case 77:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 71], [27, 52, 56, 66], [57,, 61, 65]]);
  }));
  return _scrapeMangaList.apply(this, arguments);
}

function scrapeManga(_x3, _x4) {
  return _scrapeManga.apply(this, arguments);
}
/*
Function to scrape chapter list for a specific manga from a specific provider
Example:
path: /scrape/chapter-list
body: { provider: "asura", type: "comics", slug: "damn-reincarnation" }
*/


function _scrapeManga() {
  _scrapeManga = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, MangaProvider, MangaType, MangaSlug, urlString, jsonResponse, data, response;

    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, MangaProvider = _req$body.provider, MangaType = _req$body.type, MangaSlug = _req$body.slug;
            urlString = "".concat(_utils["default"].get(MangaProvider).base, "/").concat(MangaType, "/").concat(MangaSlug, "/");
            _context2.prev = 2;
            _context2.next = 5;
            return _db["default"].getEntry("manga_".concat(MangaProvider, "_").concat(MangaSlug));

          case 5:
            data = _context2.sent;

            if (!data) {
              _context2.next = 9;
              break;
            }

            jsonResponse = new Map([["status", 409], ["statusText", "Already exist in the database: '".concat(MangaSlug, "'")]]);
            return _context2.abrupt("return", res.status(409).json(Object.fromEntries(jsonResponse)));

          case 9:
            _context2.next = 11;
            return (0, _scraper["default"])(urlString, "Manga", MangaProvider);

          case 11:
            response = _context2.sent;

            if (!(response.constructor === Error)) {
              _context2.next = 15;
              break;
            }

            jsonResponse = new Map([["status", response.cause], ["statusText", response.message]]);
            return _context2.abrupt("return", res.status(response.cause).json(Object.fromEntries(jsonResponse)));

          case 15:
            _context2.next = 17;
            return _db["default"].createEntry(Object.fromEntries(response));

          case 17:
            jsonResponse = new Map([["status", 201], ["statusText", "Created"], ["data", Object.fromEntries(response)]]);
            return _context2.abrupt("return", res.status(201).json(Object.fromEntries(jsonResponse)));

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](2);

            _logger["default"].error(_context2.t0.message);

            _logger["default"].error(_context2.t0.stack);

            jsonResponse = new Map([["status", 500], ["statusText", _context2.t0.message]]);
            return _context2.abrupt("return", res.status(500).json(Object.fromEntries(jsonResponse)));

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 21]]);
  }));
  return _scrapeManga.apply(this, arguments);
}

function scrapeChapterList(_x5, _x6) {
  return _scrapeChapterList.apply(this, arguments);
}
/*
Function to scrape a specific chapter from a specific provider
Example:
path: /scrape/chapter
body: { provider: "asura", slug: "damn-reincarnation-01" }
*/


function _scrapeChapterList() {
  _scrapeChapterList = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body2, MangaProvider, MangaType, MangaSlug, urlString, jsonResponse, response, requestId, requestStatus, failedItems, mapIterator, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, element, item, result, updatedStatus;

    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body2 = req.body, MangaProvider = _req$body2.provider, MangaType = _req$body2.type, MangaSlug = _req$body2.slug;
            urlString = "".concat(_utils["default"].get(MangaProvider).base, "/").concat(MangaType, "/").concat(MangaSlug, "/");
            _context3.prev = 2;
            _context3.next = 5;
            return (0, _scraper["default"])(urlString, "ChapterList", MangaProvider);

          case 5:
            response = _context3.sent;

            if (!(response.constructor === Error)) {
              _context3.next = 9;
              break;
            }

            jsonResponse = new Map([["status", response.cause], ["statusText", response.message]]);
            return _context3.abrupt("return", res.status(response.cause).json(Object.fromEntries(jsonResponse)));

          case 9:
            /*
            Give 202 response before processing scraped data
            Inform the requestId, so it can be checked later on
            */
            requestId = (0, _uuid.v4)();
            requestStatus = new Map([["Id", requestId], ["RequestType", "chapter-list_".concat(MangaProvider, "_").concat(MangaSlug)], ["RequestStatus", "pending"]]);
            _context3.next = 13;
            return _db["default"].createStatus(Object.fromEntries(requestStatus));

          case 13:
            jsonResponse = new Map([["status", 202], ["statusText", "Processing request..."], ["data", {
              requestId: requestId,
              requestType: "chapter-list_".concat(MangaProvider, "_").concat(MangaSlug)
            }]]);
            res.status(202).json(Object.fromEntries(jsonResponse));
            /*
            Add each element of scraped chapter list to database
            Skip if already exist in the database
            */

            failedItems = new Set();
            mapIterator = response.get("ChapterList")[Symbol.iterator]();
            _iteratorAbruptCompletion2 = false;
            _didIteratorError2 = false;
            _context3.prev = 19;
            _iterator2 = _asyncIterator(mapIterator);

          case 21:
            _context3.next = 23;
            return _iterator2.next();

          case 23:
            if (!(_iteratorAbruptCompletion2 = !(_step2 = _context3.sent).done)) {
              _context3.next = 42;
              break;
            }

            element = _step2.value;
            item = new Map([["Id", response.get("Id")], ["ChapterSlug", element[0]]]);
            _context3.next = 28;
            return _db["default"].getChapterListElement(Object.fromEntries(item));

          case 28:
            result = _context3.sent;
            console.log(result);

            if (!result) {
              _context3.next = 35;
              break;
            }

            failedItems.add("Already exist in the database: '".concat(item.get("ChapterSlug"), "'"));
            return _context3.abrupt("continue", 39);

          case 35:
            item.set("UpdatedAt", response.get("UpdatedAt"));
            item.set("ChapterDetail", Object.fromEntries(element[1]));
            _context3.next = 39;
            return _db["default"].updateChapterListElement(Object.fromEntries(item));

          case 39:
            _iteratorAbruptCompletion2 = false;
            _context3.next = 21;
            break;

          case 42:
            _context3.next = 48;
            break;

          case 44:
            _context3.prev = 44;
            _context3.t0 = _context3["catch"](19);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 48:
            _context3.prev = 48;
            _context3.prev = 49;

            if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
              _context3.next = 53;
              break;
            }

            _context3.next = 53;
            return _iterator2["return"]();

          case 53:
            _context3.prev = 53;

            if (!_didIteratorError2) {
              _context3.next = 56;
              break;
            }

            throw _iteratorError2;

          case 56:
            return _context3.finish(53);

          case 57:
            return _context3.finish(48);

          case 58:
            /*
            Update request status in the database
            Add information of skipped item if any
            */
            updatedStatus = new Map([["Id", requestId], ["RequestStatus", "completed"], ["FailedItems", failedItems.size ? Array.from(failedItems) : []]]);
            _context3.next = 61;
            return _db["default"].updateStatus(Object.fromEntries(updatedStatus));

          case 61:
            _context3.next = 69;
            break;

          case 63:
            _context3.prev = 63;
            _context3.t1 = _context3["catch"](2);

            _logger["default"].error(_context3.t1.message);

            _logger["default"].error(_context3.t1.stack);

            jsonResponse = new Map([["status", 500], ["statusText", _context3.t1.message]]);
            return _context3.abrupt("return", res.status(500).json(Object.fromEntries(jsonResponse)));

          case 69:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 63], [19, 44, 48, 58], [49,, 53, 57]]);
  }));
  return _scrapeChapterList.apply(this, arguments);
}

function scrapeChapter(_x7, _x8) {
  return _scrapeChapter.apply(this, arguments);
}

function _scrapeChapter() {
  _scrapeChapter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body3, ChapterProvider, ChapterSlug, urlString, jsonResponse, data, response;

    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body3 = req.body, ChapterProvider = _req$body3.provider, ChapterSlug = _req$body3.slug;
            urlString = "".concat(_utils["default"].get(ChapterProvider).base, "/").concat(ChapterSlug, "/");
            _context4.prev = 2;
            _context4.next = 5;
            return _db["default"].getEntry("chapter_".concat(ChapterProvider, "_").concat(ChapterSlug));

          case 5:
            data = _context4.sent;

            if (!data) {
              _context4.next = 9;
              break;
            }

            jsonResponse = new Map([["status", 409], ["statusText", "Already exist in the database: '".concat(ChapterSlug, "'")]]);
            return _context4.abrupt("return", res.status(409).json(Object.fromEntries(jsonResponse)));

          case 9:
            _context4.next = 11;
            return (0, _scraper["default"])(urlString, "Chapter", ChapterProvider);

          case 11:
            response = _context4.sent;

            if (!(response.constructor === Error)) {
              _context4.next = 15;
              break;
            }

            jsonResponse = new Map([["status", response.cause], ["statusText", response.message]]);
            return _context4.abrupt("return", res.status(response.cause).json(Object.fromEntries(jsonResponse)));

          case 15:
            _context4.next = 17;
            return _db["default"].createEntry(Object.fromEntries(response));

          case 17:
            jsonResponse = new Map([["status", 201], ["statusText", "Created"], ["data", Object.fromEntries(response)]]);
            return _context4.abrupt("return", res.status(201).json(Object.fromEntries(jsonResponse)));

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](2);

            _logger["default"].error(_context4.t0.message);

            _logger["default"].error(_context4.t0.stack);

            jsonResponse = new Map([["status", 500], ["statusText", _context4.t0.message]]);
            return _context4.abrupt("return", res.status(500).json(Object.fromEntries(jsonResponse)));

          case 27:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 21]]);
  }));
  return _scrapeChapter.apply(this, arguments);
}