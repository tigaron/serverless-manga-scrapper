"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var scraperService = _interopRequireWildcard(require("./scraper"));

var cheerio = _interopRequireWildcard(require("cheerio"));

var _globals = require("@jest/globals");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

afterEach(function () {
  _globals.jest.clearAllMocks();
});
describe("Unit test", function () {
  test("Cheerio loads correctly when valid HTML string passed as argument", function () {
    var htmlString = "<h1>Hello</h1>";

    var loadSpy = _globals.jest.spyOn(cheerio, "load");

    scraperService.loadHTML(htmlString);
    expect(loadSpy).toHaveBeenCalledWith(htmlString);
  });
  test("Cheerio throws error when no valid HTML string detected", function () {
    var htmlString = new Error("Failed to crawl", {
      cause: 404
    });

    try {
      scraperService.loadHTML(htmlString);
    } catch (error) {
      expect(error.message).toEqual("Failed to crawl");
      expect(error.cause).toEqual(404);
    }
  });
  test("parseMangaList returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<div class=\"soralist\">\n\t\t\t\t<a class=\"series\" rel=\"107248\" href=\"https://www.asurascans.com/manga/damn-reincarnation/\">Damn Reincarnation</a>\n\t\t\t\t<a class=\"series\" rel=\"70812\" href=\"https://www.asurascans.com/comics/101-duke-pendragon/\">Duke Pendragon</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseMangaList($, "asura");
    expect(result).toBeInstanceOf(Map);
    expect(Object.fromEntries(result)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      UpdatedAt: expect.any(String),
      MangaList: expect.any(Map)
    }));
    var iterator = result.get("MangaList")[Symbol.iterator]();

    var _iterator = _createForOfIteratorHelper(iterator),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        console.log(element);
      }
      /* expect(Object.fromEntries(iterator.next().value[1])).toEqual(
      	expect.objectContaining({
      		MangaTitle: expect.any(String),
      		MangaSlug: expect.any(String),
      		MangaType: expect.any(String),
      		MangaUrl: expect.any(String),
      	})
      ); */

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  test("parseManga returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://www.asurascans.com/comics/chronicles-of-the-martial-gods-return/\" />\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Chronicles Of The Martial God&#8217;s Return</h1>\n\t\t\t<div class=\"thumb\" itemprop=\"image\" itemscope itemtype=\"https://schema.org/ImageObject\">\n\t\t\t\t<img width=\"720\" height=\"972\" src=\"https://www.asurascans.com/wp-content/uploads/2022/05/martialreturnCover01.png\" class=\"attachment- size- wp-post-image\" alt=\"Chronicles Of The Martial God&#8217;s Return\" loading=\"lazy\" title=\"Chronicles Of The Martial God&#8217;s Return\" itemprop=\"image\" />\n\t\t\t</div>\n\t\t\t<div class=\"entry-content entry-content-single\" itemprop=\"description\"><div class='code-block code-block-21' style='margin: 8px auto; text-align: center; display: block; clear: both;'>\n\t\t\t\t<p>The sixth masterpiece of the Wuxia Genre that&#8217;ll meet your expectations, just like the [Third-rate Chronicles of Return], [The Conquer of the Heavenly Faction], and the [Chronicles of Seven Dragons and Seven Demons]. [Chronicles of the Martial God&#8217;s Return] The Ultimate Martial Divine Demon, Dan Woohyun, was sealed up because he was too strong for the world to handle. After a millennium passed by, he was released from his seal and felt like everything was meaningless as he wandered the back alleys&#8230; Just as he fell down because he was sick of the world, a small hand appeared in front of him. &#8220;What&#8217;s this?&#8221; asked Dan Woohyun. &#8220;A dumpling!&#8221; came a reply. This was the first time in his life that someone had been nice to him without any impure intentions, and that changed his fate. This is the chronicles of a martial god who traversed through a thousand years of time and space!</p>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseManga($, "asura");
    expect(result).toBeInstanceOf(Map);
    expect(Object.fromEntries(result)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      MangaTitle: expect.any(String),
      MangaSlug: expect.any(String),
      MangaType: expect.any(String),
      MangaProvider: expect.any(String),
      MangaUrl: expect.any(String),
      MangaCover: expect.any(String),
      MangaSynopsis: expect.any(String),
      UpdatedAt: expect.any(String)
    }));
  });
  test("parseChapterList for flame provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<div class=\"eplister\" id=\"chapterlist\">\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-116/\">\n\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\tChapter\n\t\t\t\t\t116</span>\n\t\t\t\t<span class=\"chapterdate\">August 9, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-115/\">\n\t\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\t\tChapter\n\t\t\t\t\t\t115</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 9, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-114/\">\n\t\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\t\tChapter\n\t\t\t\t\t\t114</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 2, 2022</span>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapterList($, "flame");
    expect(result).toBeInstanceOf(Set);
    var iterator = result[Symbol.iterator]();
    expect(iterator.next().value).toBeInstanceOf(Map);
    expect(Object.fromEntries(iterator.next().value)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterSlug: expect.any(String),
      ChapterProvider: expect.any(String),
      ChapterUrl: expect.any(String),
      UpdatedAt: expect.any(String)
    }));
  });
  test("parseChapterList for other provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<div class=\"eplister\" id=\"chapterlist\">\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-29/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 29</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 3, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-28/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 28</span>\n\t\t\t\t\t<span class=\"chapterdate\">July 27, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 27</span>\n\t\t\t\t\t<span class=\"chapterdate\">July 19, 2022</span>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapterList($, "asura");
    expect(result).toBeInstanceOf(Set);
    var iterator = result[Symbol.iterator]();
    expect(iterator.next().value).toBeInstanceOf(Map);
    expect(Object.fromEntries(iterator.next().value)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterSlug: expect.any(String),
      ChapterProvider: expect.any(String),
      ChapterUrl: expect.any(String),
      UpdatedAt: expect.any(String)
    }));
  });
  test("parseChapter for realm provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://realmscans.com/infinite-level-up-in-murim-chapter-123/\" />\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Infinite Level up in Murim Chapter 123</h1>\n\t\t\t<div id=\"readerarea\">\n\t\t\t\t<noscript>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-119-00.webp\" alt=\"\" width=\"900\" height=\"632\" class=\"aligncenter size-full wp-image-2717\" />\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img loading=\"lazy\" src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-1.webp\" alt=\"\" width=\"900\" height=\"6112\" class=\"aligncenter size-full wp-image-2718\" />\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img loading=\"lazy\" src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-2.webp\" alt=\"\" width=\"900\" height=\"4705\" class=\"aligncenter size-full wp-image-2719\" />\n\t\t\t\t\t</p>\n\t\t\t\t</noscript>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapter($, "realm");
    expect(result).toBeInstanceOf(Map);
    expect(Object.fromEntries(result)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterSlug: expect.any(String),
      ChapterProvider: expect.any(String),
      ChapterUrl: expect.any(String),
      ChapterContent: expect.any(Set),
      UpdatedAt: expect.any(String)
    }));
  });
  test("parseChapter for other provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/\" />\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Chronicles Of The Martial God\u2019s Return Chapter 27</h1>\n\t\t\t<div id=\"readerarea\" class=\"rdminimal\">\n\t\t\t\t<p>\n\t\t\t\t\t<img src=\"https://www.asurascans.com/wp-content/uploads/2022/07/00-277.jpg\" alt=\"\" width=\"1200\" height=\"800\" class=\"alignnone size-full wp-image-113777\" />\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<img loading=\"lazy\" src=\"https://www.asurascans.com/wp-content/uploads/2022/07/01-221.jpg\" alt=\"\" width=\"800\" height=\"12222\" class=\"alignnone size-full wp-image-113778\" />\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<img loading=\"lazy\" src=\"https://www.asurascans.com/wp-content/uploads/2022/07/02-219.jpg\" alt=\"\" width=\"800\" height=\"12222\" class=\"alignnone size-medium wp-image-113779\" />\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapter($, "asura");
    expect(result).toBeInstanceOf(Map);
    expect(Object.fromEntries(result)).toEqual(expect.objectContaining({
      Id: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterSlug: expect.any(String),
      ChapterProvider: expect.any(String),
      ChapterUrl: expect.any(String),
      ChapterContent: expect.any(Set),
      UpdatedAt: expect.any(String)
    }));
  });
});
/* 
describe("Integration test", () => {
	test("Scraper success", async () => {
		const urlString = "https://www.asurascans.com/manga/list-mode/";
		try {
			const result = await scraper(urlString, "MangaList", "asura");
			expect(result).toBeInstanceOf(Set);
		} catch (error) {
			expect(error.message).toBe(`Failed to crawl '${urlString}'`);
			expect(error.cause).not.toEqual(200);
		}
	}, 15000);
	test("Scraper fail", async () => {
		const urlString = "https://www.asurascans.com/manga/random-mode/";
		try {
			const result = await scraper(urlString, "MangaList", "asura");
			expect(result).toBeInstanceOf(Set);
		} catch (error) {
			expect(error.message).toBe(`Failed to crawl '${urlString}'`);
			expect(error.cause).not.toEqual(200);
		}
	}, 15000);
});
 */