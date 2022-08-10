"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrapeData = void 0;

var _uuid = require("uuid");

var _scraper = _interopRequireDefault(require("../services/scraper"));

var _logger = _interopRequireDefault(require("../services/logger"));

var _utils = _interopRequireDefault(require("../utils"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }

function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }

// TODO modify post behaviour to check existing database first before scraping to save resources
var scrapeData = function scrapeData(type) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
      var _req$body, source, slug, url, response, requestId, timestamp, failedItems, result, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _item;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, source = _req$body.source, slug = _req$body.slug;
              url = type === "list" ? Object.values(_utils["default"].get(source)).join("/") + "/list-mode/" : _utils["default"].get(source).base + "/".concat(slug.split("+").join("/"), "/");
              _context.prev = 2;
              _context.next = 5;
              return (0, _scraper["default"])(url, type);

            case 5:
              response = _context.sent;

              if (!response.message) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", res.status(404).json({
                statusCode: 404,
                statusText: "Unable to scrape: '".concat(slug, "'")
              }));

            case 8:
              requestId = (0, _uuid.v4)();
              _context.next = 11;
              return _db["default"].updateStatus(requestId, "pending", "".concat(source, "-").concat(type), slug);

            case 11:
              res.status(202).json({
                statusCode: 202,
                statusText: slug ? "Processing data for ".concat(source, "-").concat(type, " | ").concat(slug) : "Processing data for ".concat(source, "-").concat(type),
                requestId: requestId
              });
              timestamp = new Date();
              failedItems = [];
              _context.t0 = type;
              _context.next = _context.t0 === "list" ? 17 : _context.t0 === "manga" ? 49 : _context.t0 === "chapter" ? 85 : 90;
              break;

            case 17:
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context.prev = 19;
              _iterator = _asyncIterator(response);

            case 21:
              _context.next = 23;
              return _iterator.next();

            case 23:
              if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
                _context.next = 32;
                break;
              }

              item = _step.value;
              _context.next = 27;
              return _db["default"].createEntry({
                "Provider-Type": "".concat(source, "-").concat(type),
                Slug: "".concat(item.Slug),
                Title: "".concat(item.Title),
                Url: "".concat(item.Url),
                CreatedAt: "".concat(timestamp.toUTCString()),
                UpdatedAt: "".concat(timestamp.toUTCString())
              });

            case 27:
              result = _context.sent;
              if (result) failedItems.push(result);

            case 29:
              _iteratorAbruptCompletion = false;
              _context.next = 21;
              break;

            case 32:
              _context.next = 38;
              break;

            case 34:
              _context.prev = 34;
              _context.t1 = _context["catch"](19);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 38:
              _context.prev = 38;
              _context.prev = 39;

              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context.next = 43;
                break;
              }

              _context.next = 43;
              return _iterator["return"]();

            case 43:
              _context.prev = 43;

              if (!_didIteratorError) {
                _context.next = 46;
                break;
              }

              throw _iteratorError;

            case 46:
              return _context.finish(43);

            case 47:
              return _context.finish(38);

            case 48:
              return _context.abrupt("break", 90);

            case 49:
              _context.next = 51;
              return _db["default"].createEntry({
                "Provider-Type": "".concat(source, "-").concat(type),
                Slug: "".concat(slug),
                Title: "".concat(response.Title),
                Cover: "".concat(response.Cover),
                Synopsis: "".concat(response.Synopsis),
                CreatedAt: "".concat(timestamp.toUTCString()),
                UpdatedAt: "".concat(timestamp.toUTCString())
              });

            case 51:
              result = _context.sent;
              if (result) failedItems.push(result);
              _iteratorAbruptCompletion2 = false;
              _didIteratorError2 = false;
              _context.prev = 55;
              _iterator2 = _asyncIterator(response.Chapters);

            case 57:
              _context.next = 59;
              return _iterator2.next();

            case 59:
              if (!(_iteratorAbruptCompletion2 = !(_step2 = _context.sent).done)) {
                _context.next = 68;
                break;
              }

              _item = _step2.value;
              _context.next = 63;
              return _db["default"].createEntry({
                "Provider-Type": "".concat(source, "-chapter"),
                Slug: "".concat(_item.Slug),
                Title: "".concat(_item.Title),
                Url: "".concat(_item.Url),
                MangaSlug: "".concat(slug),
                MangaTitle: "".concat(response.Title),
                CreatedAt: "".concat(timestamp.toUTCString()),
                UpdatedAt: "".concat(timestamp.toUTCString())
              });

            case 63:
              result = _context.sent;
              if (result) failedItems.push(result);

            case 65:
              _iteratorAbruptCompletion2 = false;
              _context.next = 57;
              break;

            case 68:
              _context.next = 74;
              break;

            case 70:
              _context.prev = 70;
              _context.t2 = _context["catch"](55);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t2;

            case 74:
              _context.prev = 74;
              _context.prev = 75;

              if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                _context.next = 79;
                break;
              }

              _context.next = 79;
              return _iterator2["return"]();

            case 79:
              _context.prev = 79;

              if (!_didIteratorError2) {
                _context.next = 82;
                break;
              }

              throw _iteratorError2;

            case 82:
              return _context.finish(79);

            case 83:
              return _context.finish(74);

            case 84:
              return _context.abrupt("break", 90);

            case 85:
              _context.next = 87;
              return _db["default"].updateChapter(source, type, slug, response.Content, response.Title, timestamp.toUTCString());

            case 87:
              result = _context.sent;
              if (result) failedItems.push(result);
              return _context.abrupt("break", 90);

            case 90:
              _context.next = 92;
              return _db["default"].updateStatus(requestId, "completed", "".concat(source, "-").concat(type), slug, failedItems.filter(function (item) {
                return item;
              }));

            case 92:
              _context.next = 98;
              break;

            case 94:
              _context.prev = 94;
              _context.t3 = _context["catch"](2);

              _logger["default"].error(_context.t3.message);

              return _context.abrupt("return", res.status(500).json({
                statusCode: 500,
                statusText: _context.t3.message
              }));

            case 98:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 94], [19, 34, 38, 48], [39,, 43, 47], [55, 70, 74, 84], [75,, 79, 83]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.scrapeData = scrapeData;