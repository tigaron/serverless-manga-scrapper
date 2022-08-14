"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _express = require("@jest-mock/express");

var _globals = require("@jest/globals");

var _scrape = require("./scrape");

var _scraper = _interopRequireDefault(require("../services/scraper"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_globals.jest.mock("../services/scraper");

_globals.jest.mock("../services/logger");

_globals.jest.mock("../db");

describe("Unit test", function () {
  var _getMockRes = (0, _express.getMockRes)(),
      res = _getMockRes.res,
      clearMockRes = _getMockRes.clearMockRes;

  beforeEach(function () {
    clearMockRes();

    _globals.jest.clearAllMocks();
  });
  describe("scrapeMangaList behaviour", function () {
    test("Scraper return new data --> respond 202 --> process scraped data", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var expectedUrlString, scraperSpy, createStatusSpy, getEntrySpy, createEntrySpy, updateStatusSpy, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Set();
                result.add(new Map([["EntryId", "Entry 1"], ["EntrySlug", "This is a test entry 1"]]));
                result.add(new Map([["EntryId", "Entry 2"], ["EntrySlug", "This is a test entry 2"]]));
                result.add(new Map([["EntryId", "Entry 3"], ["EntrySlug", "This is a test entry 3"]]));
                return result;
              });
              createStatusSpy = _db["default"].createStatus.mockImplementation();
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return null;
              });
              createEntrySpy = _db["default"].createEntry.mockImplementation();
              updateStatusSpy = _db["default"].updateStatus.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "asura"
                }
              });
              _context.next = 9;
              return (0, _scrape.scrapeMangaList)(req, res);

            case 9:
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "MangaList", "asura");
              expect(createStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "pending"
              }));
              expect(res.status).toHaveBeenCalledWith(202);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 202,
                statusText: expect.any(String),
                data: expect.any(Object)
              }));
              expect(getEntrySpy).toHaveBeenCalledTimes(3);
              expect(createEntrySpy).toHaveBeenCalledTimes(3);
              expect(updateStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "completed"
              }));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    test("Scraper return old data --> respond 202 --> inform old data", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var expectedUrlString, scraperSpy, createStatusSpy, getEntrySpy, createEntrySpy, updateStatusSpy, req;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Set();
                result.add(new Map([["EntryId", "Entry 1"], ["EntrySlug", "This is a test entry 1"]]));
                result.add(new Map([["EntryId", "Entry 2"], ["EntrySlug", "This is a test entry 2"]]));
                result.add(new Map([["EntryId", "Entry 3"], ["EntrySlug", "This is a test entry 3"]]));
                return result;
              });
              createStatusSpy = _db["default"].createStatus.mockImplementation();
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return true;
              });
              createEntrySpy = _db["default"].createEntry.mockImplementation();
              updateStatusSpy = _db["default"].updateStatus.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "asura"
                }
              });
              _context2.next = 9;
              return (0, _scrape.scrapeMangaList)(req, res);

            case 9:
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "MangaList", "asura");
              expect(createStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "pending"
              }));
              expect(getEntrySpy).toHaveBeenCalledTimes(3);
              expect(createEntrySpy).not.toHaveBeenCalled();
              expect(updateStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "completed",
                FailedItems: expect.any(Array)
              }));
              expect(res.status).toHaveBeenCalledWith(202);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 202,
                statusText: expect.any(String),
                data: expect.any(Object)
              }));

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    test("Crawler/scraper failed to process request --> request aborted", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var expectedUrlString, scraperSpy, req;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                return Error("Failed to crawl '".concat(expectedUrlString, "'"), {
                  cause: 404
                });
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "asura"
                }
              });
              _context3.next = 5;
              return (0, _scrape.scrapeMangaList)(req, res);

            case 5:
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "MangaList", "asura");
              expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var createStatusSpy, req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _scraper["default"].mockImplementation(function () {
                var result = new Set();
                result.add(new Map([["EntryId", "Entry 1"], ["EntrySlug", "This is a test entry 1"]]));
                result.add(new Map([["EntryId", "Entry 2"], ["EntrySlug", "This is a test entry 2"]]));
                result.add(new Map([["EntryId", "Entry 3"], ["EntrySlug", "This is a test entry 3"]]));
                return result;
              });

              createStatusSpy = _db["default"].createStatus.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "asura"
                }
              });
              _context4.next = 5;
              return (0, _scrape.scrapeMangaList)(req, res);

            case 5:
              expect(createStatusSpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  describe("scrapeManga behaviour", function () {
    test("Scraper return new data --> process scraped data --> respond 201", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var expectedUrlString, scraperSpy, getEntrySpy, updateMangaEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Map([["EntryId", "manga_luminous_a-returners-magic-should-be-special"], ["EntrySlug", "a-returners-magic-should-be-special"]]);
                return result;
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  MangaUrl: expectedUrlString
                };
              });
              updateMangaEntrySpy = _db["default"].updateMangaEntry.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context5.next = 7;
              return (0, _scrape.scrapeManga)(req, res);

            case 7:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "Manga", "luminous");
              expect(updateMangaEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(201);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 201,
                statusText: "Created",
                data: expect.any(Object)
              }));

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    test("Full data exists in the database --> 409", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var expectedUrlString, getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  MangaUrl: expectedUrlString,
                  MangaCover: "This is just a test"
                };
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context6.next = 5;
              return (0, _scrape.scrapeManga)(req, res);

            case 5:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(res.status).toHaveBeenCalledWith(409);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 409,
                statusText: expect.any(String)
              }));

            case 8:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    test("Initial data does not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context7.next = 4;
              return (0, _scrape.scrapeManga)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    test("Crawler/scraper failed to process request --> request aborted", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var expectedUrlString, scraperSpy, getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                return Error("Failed to crawl '".concat(expectedUrlString, "'"), {
                  cause: 404
                });
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  MangaUrl: expectedUrlString
                };
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context8.next = 6;
              return (0, _scrape.scrapeManga)(req, res);

            case 6:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "Manga", "luminous");
              expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 11:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context9.next = 4;
              return (0, _scrape.scrapeManga)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
  });
  describe("scrapeChapterList behaviour", function () {
    test("Scraper return new data --> respond 202 --> process scraped data", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var expectedUrlString, scraperSpy, getEntrySpy, createStatusSpy, createEntrySpy, updateStatusSpy, req;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Set();
                result.add(new Map([["EntryId", "Entry 1"], ["EntrySlug", "This is a test entry 1"]]));
                result.add(new Map([["EntryId", "Entry 2"], ["EntrySlug", "This is a test entry 2"]]));
                result.add(new Map([["EntryId", "Entry 3"], ["EntrySlug", "This is a test entry 3"]]));
                return result;
              });
              getEntrySpy = _db["default"].getEntry;
              getEntrySpy.mockImplementationOnce(function () {
                return {
                  MangaUrl: expectedUrlString
                };
              });
              getEntrySpy.mockImplementation(function () {
                return null;
              });
              createStatusSpy = _db["default"].createStatus.mockImplementation();
              createEntrySpy = _db["default"].createEntry.mockImplementation();
              updateStatusSpy = _db["default"].updateStatus.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context10.next = 11;
              return (0, _scrape.scrapeChapterList)(req, res);

            case 11:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "ChapterList", "luminous");
              expect(createStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "pending"
              }));
              expect(res.status).toHaveBeenCalledWith(202);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 202,
                statusText: expect.any(String),
                data: expect.any(Object)
              }));
              expect(getEntrySpy).toHaveBeenCalledTimes(4);
              expect(createEntrySpy).toHaveBeenCalledTimes(3);
              expect(updateStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "completed"
              }));

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    test("Scraper return old data --> respond 202 --> inform old data", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var expectedUrlString, scraperSpy, getEntrySpy, createStatusSpy, createEntrySpy, updateStatusSpy, req;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Set();
                result.add(new Map([["EntryId", "Entry 1"], ["EntrySlug", "This is a test entry 1"]]));
                result.add(new Map([["EntryId", "Entry 2"], ["EntrySlug", "This is a test entry 2"]]));
                result.add(new Map([["EntryId", "Entry 3"], ["EntrySlug", "This is a test entry 3"]]));
                return result;
              });
              getEntrySpy = _db["default"].getEntry;
              getEntrySpy.mockImplementationOnce(function () {
                return {
                  MangaUrl: expectedUrlString
                };
              });
              getEntrySpy.mockImplementation(function () {
                return true;
              });
              createStatusSpy = _db["default"].createStatus.mockImplementation();
              createEntrySpy = _db["default"].createEntry.mockImplementation();
              updateStatusSpy = _db["default"].updateStatus.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context11.next = 11;
              return (0, _scrape.scrapeChapterList)(req, res);

            case 11:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "ChapterList", "luminous");
              expect(createStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "pending"
              }));
              expect(res.status).toHaveBeenCalledWith(202);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 202,
                statusText: expect.any(String),
                data: expect.any(Object)
              }));
              expect(getEntrySpy).toHaveBeenCalledTimes(4);
              expect(createEntrySpy).not.toHaveBeenCalled();
              expect(updateStatusSpy).toHaveBeenCalledWith(expect.objectContaining({
                RequestStatus: "completed",
                FailedItems: expect.any(Array)
              }));

            case 19:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    test("Initial data does not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context12.next = 4;
              return (0, _scrape.scrapeChapterList)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
    test("Crawler/scraper failed to process request --> request aborted", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var expectedUrlString, scraperSpy, getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                return Error("Failed to crawl '".concat(expectedUrlString, "'"), {
                  cause: 404
                });
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  MangaUrl: expectedUrlString
                };
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context13.next = 6;
              return (0, _scrape.scrapeChapterList)(req, res);

            case 6:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "ChapterList", "luminous");
              expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 11:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              _context14.next = 4;
              return (0, _scrape.scrapeChapterList)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("manga_luminous", "a-returners-magic-should-be-special");
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
  describe("scrapeChapter behaviour", function () {
    test("Scraper return new data --> process scraped data --> respond 201", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
      var expectedUrlString, scraperSpy, getEntrySpy, updateChapterEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                var result = new Map([["EntryId", "chapter_luminous_a-returners-magic-should-be-special"], ["EntrySlug", "a-returners-magic-should-be-special-chapter-1"]]);
                return result;
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  ChapterUrl: expectedUrlString
                };
              });
              updateChapterEntrySpy = _db["default"].updateChapterEntry.mockImplementation();
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              _context15.next = 7;
              return (0, _scrape.scrapeChapter)(req, res);

            case 7:
              expect(getEntrySpy).toHaveBeenCalledWith("chapter_luminous_a-returners-magic-should-be-special", "a-returners-magic-should-be-special-chapter-1");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "Chapter", "luminous");
              expect(updateChapterEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(201);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 201,
                statusText: "Created",
                data: expect.any(Object)
              }));

            case 12:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    test("Full data exists in the database --> 409", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
      var expectedUrlString, getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/";
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  ChapterUrl: expectedUrlString,
                  ChapterContent: "This is just a test"
                };
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              _context16.next = 5;
              return (0, _scrape.scrapeChapter)(req, res);

            case 5:
              expect(getEntrySpy).toHaveBeenCalledWith("chapter_luminous_a-returners-magic-should-be-special", "a-returners-magic-should-be-special-chapter-1");
              expect(res.status).toHaveBeenCalledWith(409);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 409,
                statusText: expect.any(String)
              }));

            case 8:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
    test("Initial data does not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              _context17.next = 4;
              return (0, _scrape.scrapeChapter)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("chapter_luminous_a-returners-magic-should-be-special", "a-returners-magic-should-be-special-chapter-1");
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
    test("Crawler/scraper failed to process request --> request aborted", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
      var expectedUrlString, scraperSpy, getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              expectedUrlString = "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/";
              scraperSpy = _scraper["default"].mockImplementation(function () {
                return Error("Failed to crawl '".concat(expectedUrlString, "'"), {
                  cause: 404
                });
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return {
                  ChapterUrl: expectedUrlString
                };
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              _context18.next = 6;
              return (0, _scrape.scrapeChapter)(req, res);

            case 6:
              expect(getEntrySpy).toHaveBeenCalledWith("chapter_luminous_a-returners-magic-should-be-special", "a-returners-magic-should-be-special-chapter-1");
              expect(scraperSpy).toHaveBeenCalledWith(expectedUrlString, "Chapter", "luminous");
              expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 11:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
      var getEntrySpy, req;
      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              req = (0, _express.getMockReq)({
                body: {
                  provider: "luminous",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              _context19.next = 4;
              return (0, _scrape.scrapeChapter)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalledWith("chapter_luminous_a-returners-magic-should-be-special", "a-returners-magic-should-be-special-chapter-1");
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    })));
  });
});