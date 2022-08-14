"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _express = require("@jest-mock/express");

var _globals = require("@jest/globals");

var _fetch = require("./fetch");

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_globals.jest.mock("../db");

_globals.jest.mock("../services/logger");

describe("Unit test", function () {
  var _getMockRes = (0, _express.getMockRes)(),
      res = _getMockRes.res,
      clearMockRes = _getMockRes.clearMockRes;

  beforeEach(function () {
    clearMockRes();

    _globals.jest.clearAllMocks();
  });
  describe("fetchStatus behaviour", function () {
    test("UUID exists in the database --> 200", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var req, expectedResult, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5"
                }
              });
              expectedResult = {
                EntryId: "request-status",
                EntrySlug: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5",
                FailedItems: ["Already exist in the database: 'battle-of-the-six-realms'", "Already exist in the database: 'berserk-of-gluttony'"],
                RequestStatus: "completed"
              };
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return expectedResult;
              });
              _context.next = 5;
              return (0, _fetch.fetchStatus)(req, res);

            case 5:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(200);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: expectedResult
              }));

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    test("UUID does not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              _context2.next = 4;
              return (0, _fetch.fetchStatus)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              _context3.next = 4;
              return (0, _fetch.fetchStatus)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  describe("fetchProviderList behaviour", function () {
    test("UUID exists in the database --> 200", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              req = (0, _express.getMockReq)();
              _context4.next = 3;
              return (0, _fetch.fetchProviderList)(req, res);

            case 3:
              expect(res.status).toHaveBeenCalledWith(200);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: expect.any(Array)
              }));

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  describe("fetchListData behaviour", function () {
    test("EntryId exists in the database --> 200", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var req, expectedResult, getCollectionSpy;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura"
                }
              });
              expectedResult = [{
                EntryId: "manga_asura",
                MangaTitle: "A Comic Artist’s Survival Guide",
                EntrySlug: "a-comic-artists-survival-guide",
                MangaUrl: "https://www.asurascans.com/manga/1660333069-a-comic-artists-survival-guide/",
                ScrapeDate: "Sun, 14 Aug 2022 04:19:34 GMT"
              }, {
                EntryId: "manga_asura",
                MangaTitle: "Above the Heavens",
                EntrySlug: "above-the-heavens",
                MangaUrl: "https://www.asurascans.com/manga/1660333069-above-the-heavens/",
                ScrapeDate: "Sun, 14 Aug 2022 04:19:34 GMT"
              }];
              getCollectionSpy = _db["default"].getCollection.mockImplementation(function () {
                return expectedResult;
              });
              _context5.next = 5;
              return (0, _fetch.fetchListData)(req, res);

            case 5:
              expect(getCollectionSpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(200);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: expectedResult
              }));

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    test("EntryId does not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var req, getCollectionSpy;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "hello"
                }
              });
              getCollectionSpy = _db["default"].getCollection.mockImplementation(function () {
                return false;
              });
              _context6.next = 4;
              return (0, _fetch.fetchListData)(req, res);

            case 4:
              expect(getCollectionSpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var req, getCollectionSpy;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura"
                }
              });
              getCollectionSpy = _db["default"].getCollection.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              _context7.next = 4;
              return (0, _fetch.fetchListData)(req, res);

            case 4:
              expect(getCollectionSpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
  });
  describe("fetchMangaData behaviour", function () {
    test("EntryId and EntrySlug exist in the database --> 200", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var req, expectedResult, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              expectedResult = {
                EntryId: "manga_luminous",
                MangaTitle: "A Returner’s Magic Should Be Special",
                MangaCover: "https://luminousscans.com/wp-content/uploads/2022/06/resource.png",
                MangaShortUrl: "https://luminousscans.com/?p=41295",
                EntrySlug: "a-returners-magic-should-be-special",
                MangaUrl: "https://luminousscans.com/series/a-returners-magic-should-be-special/",
                MangaSynopsis: "For 10 years, magical prodigy Desir and his party have been battling inside the mysterious Shadow Labyrinth—and against the end of the world. Much of humanity has already perished and just as Desir is about to be killed, he’s sent back 13 years into the past. Despite knowing the cursed future that lies ahead, Desir steels his resolve as he sees an opportunity to train his friends and better prepare to face Armageddon together, without losing the ones they love!",
                MangaCanonicalUrl: "https://luminousscans.com/series/a-returners-magic-should-be-special/",
                ScrapeDate: "Sun, 14 Aug 2022 03:05:09 GMT"
              };
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return expectedResult;
              });
              _context8.next = 5;
              return (0, _fetch.fetchMangaData)(req, res);

            case 5:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(200);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: expectedResult
              }));

            case 8:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    test("EntryId and EntrySlug do not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              _context9.next = 4;
              return (0, _fetch.fetchMangaData)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(404);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 404,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura",
                  slug: "a-returners-magic-should-be-special"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              _context10.next = 4;
              return (0, _fetch.fetchMangaData)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  describe("fetchChapterData behaviour", function () {
    test("EntryId and EntrySlug exist in the database --> 200", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var req, expectedResult, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              expectedResult = {
                EntryId: "chapter_luminous_a-returners-magic-should-be-special",
                ChapterContent: ["https://luminousscans.com/wp-content/uploads/2022/07/01.jpg", "https://luminousscans.com/wp-content/uploads/2022/07/02.jpg", "https://luminousscans.com/wp-content/uploads/2022/07/03.jpg"],
                EntrySlug: "a-returners-magic-should-be-special-chapter-1",
                ChapterShortUrl: "https://luminousscans.com/?p=42041",
                ChapterTitle: "A Returner’s Magic Should Be Special Chapter 1",
                ChapterCanonicalUrl: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/",
                ChapterDate: "June 28, 2022",
                ChapterNumber: "Chapter 1",
                ChapterUrl: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/",
                ScrapeDate: "Sun, 14 Aug 2022 03:12:37 GMT"
              };
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return expectedResult;
              });
              _context11.next = 5;
              return (0, _fetch.fetchChapterData)(req, res);

            case 5:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(200);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: expectedResult
              }));

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    test("EntryId and EntrySlug do not exist in the database --> 404", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura",
                  manga: "a-returners-magic-should-be-special",
                  slug: "a-returners-magic-should-be-special-chapter-1"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                return false;
              });
              _context12.next = 4;
              return (0, _fetch.fetchChapterData)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
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
    test("Error occurs on the server/database --> 500", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var req, getEntrySpy;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              req = (0, _express.getMockReq)({
                params: {
                  provider: "asura"
                }
              });
              getEntrySpy = _db["default"].getEntry.mockImplementation(function () {
                throw new Error("This is just a test");
              });
              _context13.next = 4;
              return (0, _fetch.fetchChapterData)(req, res);

            case 4:
              expect(getEntrySpy).toHaveBeenCalled();
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                status: 500,
                statusText: expect.any(String)
              }));

            case 7:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
  });
});
describe("Integration test", function () {});