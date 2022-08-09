"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.updateEntry = exports.updateChapter = exports.getMangaList = exports.getEntry = exports.getChapterList = exports.dbService = exports.createEntry = exports.checkStatus = void 0;

var _logger = _interopRequireDefault(require("./logger"));

var _dynamodb = require("../configs/dynamodb");

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

var _utilDynamodb = require("@aws-sdk/util-dynamodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var TABLE_MANGA = process.env.TABLE_MANGA;

var createEntry = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(item) {
    var table,
        params,
        _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            table = _args.length > 1 && _args[1] !== undefined ? _args[1] : TABLE_MANGA;
            params = {
              TableName: table,
              Item: (0, _utilDynamodb.marshall)(item),
              ExpressionAttributeNames: {
                "#PT": "Provider-Type",
                "#S": "Slug"
              },
              ExpressionAttributeValues: {
                ":pt": (0, _utilDynamodb.marshall)(item["Provider-Type"]),
                ":s": (0, _utilDynamodb.marshall)(item["Slug"])
              },
              ConditionExpression: "(NOT #PT = :pt) AND (NOT #S = :s)"
            };
            _context.prev = 2;
            _context.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.PutItemCommand(params));

          case 5:
            _context.next = 16;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](2);

            _logger["default"].debug("Put fail: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

            _logger["default"].warn(_context.t0.message);

            if (!(_context.t0.message === "The conditional request failed")) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", "Already exist in database: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

          case 15:
            return _context.abrupt("return", "Failed to add to database: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 7]]);
  }));

  return function createEntry(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.createEntry = createEntry;

var getEntry = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(provider, type, slug) {
    var table,
        params,
        _yield$dynamodb$send,
        Item,
        _args2 = arguments;

    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            table = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : TABLE_MANGA;
            params = {
              TableName: table,
              Key: {
                "Provider-Type": {
                  S: "".concat(provider, "-").concat(type)
                },
                Slug: {
                  S: "".concat(slug)
                }
              }
            };
            _context2.prev = 2;
            _context2.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.GetItemCommand(params));

          case 5:
            _yield$dynamodb$send = _context2.sent;
            Item = _yield$dynamodb$send.Item;

            if (!(Item == undefined)) {
              _context2.next = 9;
              break;
            }

            throw new Error("Unable to find data for '".concat(slug, "'"));

          case 9:
            return _context2.abrupt("return", (0, _utilDynamodb.unmarshall)(Item));

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);

            _logger["default"].debug("Get fail: ".concat(provider, "-").concat(type, " | ").concat(slug));

            _logger["default"].warn(_context2.t0.message);

            return _context2.abrupt("return", _context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12]]);
  }));

  return function getEntry(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getEntry = getEntry;

var updateEntry = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(item) {
    var table,
        params,
        _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            table = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : TABLE_MANGA;
            params = {
              TableName: table,
              Item: (0, _utilDynamodb.marshall)(item),
              ExpressionAttributeNames: {
                "#PT": "Provider-Type",
                "#S": "Slug"
              },
              ExpressionAttributeValues: {
                ":pt": (0, _utilDynamodb.marshall)(item["Provider-Type"]),
                ":s": (0, _utilDynamodb.marshall)(item["Slug"])
              },
              ConditionExpression: "#PT = :pt AND #S = :s"
            };
            _context3.prev = 2;
            _context3.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.PutItemCommand(params));

          case 5:
            _context3.next = 12;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](2);

            _logger["default"].debug("Put fail: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

            _logger["default"].warn(_context3.t0.message);

            return _context3.abrupt("return", "Failed to update database entry: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 7]]);
  }));

  return function updateEntry(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateEntry = updateEntry;

var updateChapter = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(provider, type, slug, items, title, timestamp) {
    var table,
        params,
        _args4 = arguments;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            table = _args4.length > 6 && _args4[6] !== undefined ? _args4[6] : TABLE_MANGA;
            params = {
              TableName: table,
              Key: {
                "Provider-Type": {
                  S: "".concat(provider, "-").concat(type)
                },
                Slug: {
                  S: "".concat(slug)
                }
              },
              ExpressionAttributeNames: {
                "#C": "Content",
                "#T": "Title",
                "#UT": "UpdatedAt"
              },
              ExpressionAttributeValues: {
                ":c": {
                  L: items.map(function (item) {
                    return {
                      S: item
                    };
                  })
                },
                ":t": {
                  S: title
                },
                ":ut": {
                  S: timestamp
                }
              },
              UpdateExpression: "SET #C = :c, #T = :t, #UT = :ut"
            };
            _context4.prev = 2;
            _context4.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.UpdateItemCommand(params));

          case 5:
            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](2);

            _logger["default"].debug("Update fail: ".concat(provider, "-").concat(type, " | ").concat(slug));

            _logger["default"].warn(_context4.t0.message);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 7]]);
  }));

  return function updateChapter(_x6, _x7, _x8, _x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateChapter = updateChapter;

var getMangaList = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(provider) {
    var table,
        params,
        _yield$dynamodb$send2,
        Items,
        _args5 = arguments;

    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            table = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : TABLE_MANGA;
            params = {
              TableName: table,
              ExpressionAttributeNames: {
                "#PT": "Provider-Type"
              },
              ExpressionAttributeValues: {
                ":pt": {
                  S: "".concat(provider, "-list")
                }
              },
              KeyConditionExpression: "#PT = :pt"
            };
            _context5.prev = 2;
            _context5.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.QueryCommand(params));

          case 5:
            _yield$dynamodb$send2 = _context5.sent;
            Items = _yield$dynamodb$send2.Items;

            if (!(Items == undefined)) {
              _context5.next = 9;
              break;
            }

            throw new Error("Unable to find data for '".concat(provider, "'"));

          case 9:
            return _context5.abrupt("return", Items.map(function (item) {
              return (0, _utilDynamodb.unmarshall)(item);
            }));

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](2);

            _logger["default"].debug("Query fail: ".concat(provider, "-list"));

            _logger["default"].warn(_context5.t0.message);

            return _context5.abrupt("return", _context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 12]]);
  }));

  return function getMangaList(_x12) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getMangaList = getMangaList;

var getChapterList = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(provider, slug) {
    var table,
        params,
        _yield$dynamodb$send3,
        Items,
        _args6 = arguments;

    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            table = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : TABLE_MANGA;
            params = {
              TableName: table,
              ExpressionAttributeNames: {
                "#PT": "Provider-Type",
                "#U": "Url"
              },
              ExpressionAttributeValues: {
                ":pt": {
                  S: "".concat(provider, "-chapter")
                },
                ":ms": {
                  S: "".concat(slug)
                }
              },
              KeyConditionExpression: "#PT = :pt",
              FilterExpression: "contains (MangaSlug, :ms)",
              ProjectionExpression: "Title, Slug, #U"
            };
            _context6.prev = 2;
            _context6.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.QueryCommand(params));

          case 5:
            _yield$dynamodb$send3 = _context6.sent;
            Items = _yield$dynamodb$send3.Items;

            if (!(Items == undefined)) {
              _context6.next = 9;
              break;
            }

            throw new Error("Unable to find data for '".concat(slug, "'"));

          case 9:
            return _context6.abrupt("return", Items.map(function (item) {
              return (0, _utilDynamodb.unmarshall)(item);
            }));

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](2);

            _logger["default"].debug("Query fail: ".concat(provider, "-chapter | ").concat(slug));

            _logger["default"].warn(_context6.t0.message);

            return _context6.abrupt("return", _context6.t0);

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 12]]);
  }));

  return function getChapterList(_x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getChapterList = getChapterList;

var updateStatus = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id, status, type, req, failed) {
    var table,
        item,
        params,
        _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            table = _args7.length > 5 && _args7[5] !== undefined ? _args7[5] : TABLE_MANGA;
            item = {
              "Provider-Type": "request-status",
              Slug: id,
              Request: req ? "".concat(type, " | ").concat(req) : "".concat(type),
              Status: status,
              FailedItems: failed ? failed : []
            };
            params = {
              TableName: table,
              Item: (0, _utilDynamodb.marshall)(item)
            };
            _context7.prev = 3;
            _context7.next = 6;
            return _dynamodb.dynamodb.send(new _clientDynamodb.PutItemCommand(params));

          case 6:
            _context7.next = 12;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](3);

            _logger["default"].debug("Put fail: ".concat(item["Provider-Type"], " | ").concat(item["Slug"]));

            _logger["default"].warn(_context7.t0.message);

          case 12:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 8]]);
  }));

  return function updateStatus(_x15, _x16, _x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateStatus = updateStatus;

var checkStatus = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(id) {
    var table,
        params,
        _yield$dynamodb$send4,
        Item,
        unmappedItems,
        result,
        _args8 = arguments;

    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            table = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : TABLE_MANGA;
            params = {
              TableName: table,
              Key: {
                "Provider-Type": {
                  S: "request-status"
                },
                Slug: {
                  S: "".concat(id)
                }
              }
            };
            _context8.prev = 2;
            _context8.next = 5;
            return _dynamodb.dynamodb.send(new _clientDynamodb.GetItemCommand(params));

          case 5:
            _yield$dynamodb$send4 = _context8.sent;
            Item = _yield$dynamodb$send4.Item;

            if (!(Item == undefined)) {
              _context8.next = 9;
              break;
            }

            throw new Error("Unable to find data for '".concat(id, "'"));

          case 9:
            unmappedItems = (0, _utilDynamodb.unmarshall)(Item);
            result = new Map();
            result.set("Provider-Type", unmappedItems["Provider-Type"]);
            result.set("Slug", unmappedItems["Slug"]);
            result.set("Request", unmappedItems["Request"]);
            result.set("Status", unmappedItems["Status"]);
            result.set("FailedItems", unmappedItems["FailedItems"]);
            return _context8.abrupt("return", result);

          case 19:
            _context8.prev = 19;
            _context8.t0 = _context8["catch"](2);

            _logger["default"].debug("Get fail: request-status | ".concat(id));

            _logger["default"].warn(_context8.t0.message);

            return _context8.abrupt("return", _context8.t0);

          case 24:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[2, 19]]);
  }));

  return function checkStatus(_x20) {
    return _ref8.apply(this, arguments);
  };
}();

exports.checkStatus = checkStatus;
var dbService = {
  createEntry: createEntry,
  updateEntry: updateEntry,
  updateChapter: updateChapter,
  getEntry: getEntry,
  getMangaList: getMangaList,
  getChapterList: getChapterList,
  checkStatus: checkStatus,
  updateStatus: updateStatus
};
exports.dbService = dbService;