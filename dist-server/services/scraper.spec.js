"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var scraperService = _interopRequireWildcard(require("./scraper"));

var cheerio = _interopRequireWildcard(require("cheerio"));

var _mapToObject = _interopRequireDefault(require("../utils/mapToObject"));

var _globals = require("@jest/globals");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_globals.jest.mock("../services/logger");

afterEach(function () {
  _globals.jest.clearAllMocks();
});
describe("Unit test", function () {
  test("loadHTML loads valid HTML when string passed as argument", function () {
    var htmlString = "<h1>Hello</h1>";

    var loadSpy = _globals.jest.spyOn(cheerio, "load");

    scraperService.loadHTML(htmlString);
    expect(loadSpy).toHaveBeenCalledWith(htmlString);
  });
  test("loadHTML throws error when no valid HTML string detected", function () {
    var htmlString = new Error("Failed to crawl", {
      cause: 404
    });

    var loadSpy = _globals.jest.spyOn(cheerio, "load");

    try {
      scraperService.loadHTML(htmlString);
    } catch (error) {
      expect(loadSpy).not.toHaveBeenCalled();
      expect(error.message).toEqual("Failed to crawl");
      expect(error.cause).toEqual(404);
    }
  });
  test("parseMangaList returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<div class=\"soralist\">\n\t\t\t\t<a class=\"series\" rel=\"107248\" href=\"https://www.asurascans.com/manga/damn-reincarnation/\">Damn Reincarnation</a>\n\t\t\t\t<a class=\"series\" rel=\"70812\" href=\"https://www.asurascans.com/comics/101-duke-pendragon/\">Duke Pendragon</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseMangaList($, "asura");
    expect(result).toBeInstanceOf(Set);
    expect(Array.from(result)).toContainEqual(expect.any(Map));
    expect((0, _mapToObject["default"])(Array.from(result)[0])).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      MangaTitle: expect.any(String),
      MangaUrl: expect.any(String),
      ScrapeDate: expect.any(String)
    }));
  });
  test("parseManga returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://www.asurascans.com/comics/chronicles-of-the-martial-gods-return/\" />\n\t\t\t<link rel=\"shortlink\" href=\"https://www.asurascans.com/?p=1234/\" />\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Chronicles Of The Martial God&#8217;s Return</h1>\n\t\t\t<div class=\"thumb\" itemprop=\"image\" itemscope itemtype=\"https://schema.org/ImageObject\">\n\t\t\t\t<img width=\"720\" height=\"972\" src=\"https://www.asurascans.com/wp-content/uploads/2022/05/martialreturnCover01.png\" class=\"attachment- size- wp-post-image\" alt=\"Chronicles Of The Martial God&#8217;s Return\" loading=\"lazy\" title=\"Chronicles Of The Martial God&#8217;s Return\" itemprop=\"image\" />\n\t\t\t</div>\n\t\t\t<div class=\"entry-content entry-content-single\" itemprop=\"description\"><div class='code-block code-block-21' style='margin: 8px auto; text-align: center; display: block; clear: both;'>\n\t\t\t\t<p>The sixth masterpiece of the Wuxia Genre that&#8217;ll meet your expectations, just like the [Third-rate Chronicles of Return], [The Conquer of the Heavenly Faction], and the [Chronicles of Seven Dragons and Seven Demons]. [Chronicles of the Martial God&#8217;s Return] The Ultimate Martial Divine Demon, Dan Woohyun, was sealed up because he was too strong for the world to handle. After a millennium passed by, he was released from his seal and felt like everything was meaningless as he wandered the back alleys&#8230; Just as he fell down because he was sick of the world, a small hand appeared in front of him. &#8220;What&#8217;s this?&#8221; asked Dan Woohyun. &#8220;A dumpling!&#8221; came a reply. This was the first time in his life that someone had been nice to him without any impure intentions, and that changed his fate. This is the chronicles of a martial god who traversed through a thousand years of time and space!</p>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseManga($, "asura");
    expect(result).toBeInstanceOf(Map);
    expect((0, _mapToObject["default"])(result)).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      MangaCanonicalUrl: expect.any(String),
      MangaCover: expect.any(String),
      MangaShortUrl: expect.any(String),
      MangaSynopsis: expect.any(String),
      MangaTitle: expect.any(String),
      ScrapeDate: expect.any(String)
    }));
  });
  test("parseChapterList for flame provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://flamescans.org/series/the-ancient-sovereign-of-eternity/\" />\n\t\t\t<div class=\"eplister\" id=\"chapterlist\">\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-116/\">\n\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\tChapter\n\t\t\t\t\t116</span>\n\t\t\t\t<span class=\"chapterdate\">August 9, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-115/\">\n\t\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\t\tChapter\n\t\t\t\t\t\t115</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 9, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-114/\">\n\t\t\t\t\t<span class=\"chapternum\">\n\t\t\t\t\t\tChapter\n\t\t\t\t\t\t114</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 2, 2022</span>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapterList($, "flame");
    expect(result).toBeInstanceOf(Set);
    expect(Array.from(result)).toContainEqual(expect.any(Map));
    expect((0, _mapToObject["default"])(Array.from(result)[0])).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      ChapterNumber: expect.any(String),
      ChapterDate: expect.any(String),
      ChapterUrl: expect.any(String),
      ScrapeDate: expect.any(String)
    }));
  });
  test("parseChapterList for other provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://www.asurascans.com/comics/chronicles-of-the-martial-gods-return/\" />\n\t\t\t<div class=\"eplister\" id=\"chapterlist\">\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-29/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 29</span>\n\t\t\t\t\t<span class=\"chapterdate\">August 3, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-28/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 28</span>\n\t\t\t\t\t<span class=\"chapterdate\">July 27, 2022</span>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/\">\n\t\t\t\t\t<span class=\"chapternum\">Chapter 27</span>\n\t\t\t\t\t<span class=\"chapterdate\">July 19, 2022</span>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapterList($, "asura");
    expect(result).toBeInstanceOf(Set);
    expect(Array.from(result)).toContainEqual(expect.any(Map));
    expect((0, _mapToObject["default"])(Array.from(result)[0])).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      ChapterNumber: expect.any(String),
      ChapterDate: expect.any(String),
      ChapterUrl: expect.any(String),
      ScrapeDate: expect.any(String)
    }));
  });
  test("parseChapter for realm provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://realmscans.com/infinite-level-up-in-murim-chapter-123/\" />\n\t\t\t<link rel=\"shortlink\" href=\"https://realmscans.com/?p=1234/\" />\n\t\t\t<div class=\"allc\"><a href=\"https://realmscans.com/series/infinite-level-up-in-murim/\">Infinite Level up in Murim</a></div>\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Infinite Level up in Murim Chapter 123</h1>\n\t\t\t<div id=\"readerarea\">\n\t\t\t\t<noscript>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-119-00.webp\" alt=\"\" width=\"900\" height=\"632\" class=\"aligncenter size-full wp-image-2717\" />\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img loading=\"lazy\" src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-1.webp\" alt=\"\" width=\"900\" height=\"6112\" class=\"aligncenter size-full wp-image-2718\" />\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<img loading=\"lazy\" src=\"https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-2.webp\" alt=\"\" width=\"900\" height=\"4705\" class=\"aligncenter size-full wp-image-2719\" />\n\t\t\t\t\t</p>\n\t\t\t\t</noscript>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapter($, "realm");
    expect(result).toBeInstanceOf(Map);
    expect((0, _mapToObject["default"])(result)).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterShortUrl: expect.any(String),
      ChapterCanonicalUrl: expect.any(String),
      ChapterContent: expect.any(Array),
      ScrapeDate: expect.any(String)
    }));
  });
  test("parseChapter for other provider returns expected values", function () {
    var $ = cheerio.load("\n\t\t\t<link rel=\"canonical\" href=\"https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/\" />\n\t\t\t<link rel=\"shortlink\" href=\"https://www.asurascans.com/?p=1234/\" />\n\t\t\t<div class=\"allc\"><a href=\"https://www.asurascans.com/manga/chronicles-of-the-martial-gods-return/\">Chronicles Of The Martial God\u2019s Return</a></div>\n\t\t\t<h1 class=\"entry-title\" itemprop=\"name\">Chronicles Of The Martial God\u2019s Return Chapter 27</h1>\n\t\t\t<div id=\"readerarea\" class=\"rdminimal\">\n\t\t\t\t<p>\n\t\t\t\t\t<img src=\"https://www.asurascans.com/wp-content/uploads/2022/07/00-277.jpg\" alt=\"\" width=\"1200\" height=\"800\" class=\"alignnone size-full wp-image-113777\" />\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<img loading=\"lazy\" src=\"https://www.asurascans.com/wp-content/uploads/2022/07/01-221.jpg\" alt=\"\" width=\"800\" height=\"12222\" class=\"alignnone size-full wp-image-113778\" />\n\t\t\t\t</p>\n\t\t\t\t<p>\n\t\t\t\t\t<img loading=\"lazy\" src=\"https://www.asurascans.com/wp-content/uploads/2022/07/02-219.jpg\" alt=\"\" width=\"800\" height=\"12222\" class=\"alignnone size-medium wp-image-113779\" />\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t");
    var result = scraperService.parseChapter($, "asura");
    expect(result).toBeInstanceOf(Map);
    expect((0, _mapToObject["default"])(result)).toEqual(expect.objectContaining({
      EntryId: expect.any(String),
      EntrySlug: expect.any(String),
      ChapterTitle: expect.any(String),
      ChapterShortUrl: expect.any(String),
      ChapterCanonicalUrl: expect.any(String),
      ChapterContent: expect.any(Array),
      ScrapeDate: expect.any(String)
    }));
  });
});
/* describe("Integration test", () => {
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
			expect(result).toBeInstanceOf(Error);
		} catch (error) {
			expect(error.message).toBe(`Failed to crawl '${urlString}'`);
			expect(error.cause).not.toEqual(200);
		}
	}, 15000);
});
 */