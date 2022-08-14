import scraper, * as scraperService from "./scraper";
import * as cheerio from "cheerio";
import mapToObject from "../utils/mapToObject";
import { jest } from "@jest/globals";

jest.mock("../services/logger");
afterEach(() => {
	jest.clearAllMocks();
});

describe("Unit test", () => {
	test("loadHTML loads valid HTML when string passed as argument", () => {
		const htmlString = "<h1>Hello</h1>";
		const loadSpy = jest.spyOn(cheerio, "load");
		scraperService.loadHTML(htmlString);
		expect(loadSpy).toHaveBeenCalledWith(htmlString);
	});
	
	test("loadHTML throws error when no valid HTML string detected", () => {
		const htmlString = new Error("Failed to crawl", { cause: 404 });
		const loadSpy = jest.spyOn(cheerio, "load");
		try {
			scraperService.loadHTML(htmlString);
		} catch (error) {
			expect(loadSpy).not.toHaveBeenCalled();
			expect(error.message).toEqual("Failed to crawl");
			expect(error.cause).toEqual(404);
		}
	});
	
	test("parseMangaList returns expected values", () => {
		const $ = cheerio.load(`
			<div class="soralist">
				<a class="series" rel="107248" href="https://www.asurascans.com/manga/damn-reincarnation/">Damn Reincarnation</a>
				<a class="series" rel="70812" href="https://www.asurascans.com/comics/101-duke-pendragon/">Duke Pendragon</a>
			</div>
			`);
		const result = scraperService.parseMangaList($, "asura");
		expect(result).toBeInstanceOf(Set);
		expect(Array.from(result)).toContainEqual(expect.any(Map));
		expect(mapToObject(Array.from(result)[0])).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				MangaTitle: expect.any(String),
				MangaUrl: expect.any(String),
				ScrapeDate: expect.any(String),
			})
		);
	});

	test("parseManga returns expected values", () => {
		const $ = cheerio.load(`
			<link rel="canonical" href="https://www.asurascans.com/comics/chronicles-of-the-martial-gods-return/" />
			<link rel="shortlink" href="https://www.asurascans.com/?p=1234/" />
			<h1 class="entry-title" itemprop="name">Chronicles Of The Martial God&#8217;s Return</h1>
			<div class="thumb" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
				<img width="720" height="972" src="https://www.asurascans.com/wp-content/uploads/2022/05/martialreturnCover01.png" class="attachment- size- wp-post-image" alt="Chronicles Of The Martial God&#8217;s Return" loading="lazy" title="Chronicles Of The Martial God&#8217;s Return" itemprop="image" />
			</div>
			<div class="entry-content entry-content-single" itemprop="description"><div class='code-block code-block-21' style='margin: 8px auto; text-align: center; display: block; clear: both;'>
				<p>The sixth masterpiece of the Wuxia Genre that&#8217;ll meet your expectations, just like the [Third-rate Chronicles of Return], [The Conquer of the Heavenly Faction], and the [Chronicles of Seven Dragons and Seven Demons]. [Chronicles of the Martial God&#8217;s Return] The Ultimate Martial Divine Demon, Dan Woohyun, was sealed up because he was too strong for the world to handle. After a millennium passed by, he was released from his seal and felt like everything was meaningless as he wandered the back alleys&#8230; Just as he fell down because he was sick of the world, a small hand appeared in front of him. &#8220;What&#8217;s this?&#8221; asked Dan Woohyun. &#8220;A dumpling!&#8221; came a reply. This was the first time in his life that someone had been nice to him without any impure intentions, and that changed his fate. This is the chronicles of a martial god who traversed through a thousand years of time and space!</p>
			</div>
			`);
		const result = scraperService.parseManga($, "asura");
		expect(result).toBeInstanceOf(Map);
		expect(mapToObject(result)).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				MangaCanonicalUrl: expect.any(String),
				MangaCover: expect.any(String),
				MangaShortUrl: expect.any(String),
				MangaSynopsis: expect.any(String),
				MangaTitle: expect.any(String),
				ScrapeDate: expect.any(String),
			})
		);
	});

	test("parseChapterList for flame provider returns expected values", () => {
		const $ = cheerio.load(`
			<link rel="canonical" href="https://flamescans.org/series/the-ancient-sovereign-of-eternity/" />
			<div class="eplister" id="chapterlist">
				<a href="https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-116/">
				<span class="chapternum">
					Chapter
					116</span>
				<span class="chapterdate">August 9, 2022</span>
				</a>
				<a href="https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-115/">
					<span class="chapternum">
						Chapter
						115</span>
					<span class="chapterdate">August 9, 2022</span>
				</a>
				<a href="https://flamescans.org/the-ancient-sovereign-of-eternity-chapter-114/">
					<span class="chapternum">
						Chapter
						114</span>
					<span class="chapterdate">August 2, 2022</span>
				</a>
			</div>
			`);
		const result = scraperService.parseChapterList($, "flame");
		expect(result).toBeInstanceOf(Set);
		expect(Array.from(result)).toContainEqual(expect.any(Map));
		expect(mapToObject(Array.from(result)[0])).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				ChapterNumber: expect.any(String),
				ChapterDate: expect.any(String),
				ChapterUrl: expect.any(String),
				ScrapeDate: expect.any(String),
			})
		);
	});
 
	test("parseChapterList for other provider returns expected values", () => {
		const $ = cheerio.load(`
			<link rel="canonical" href="https://www.asurascans.com/comics/chronicles-of-the-martial-gods-return/" />
			<div class="eplister" id="chapterlist">
				<a href="https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-29/">
					<span class="chapternum">Chapter 29</span>
					<span class="chapterdate">August 3, 2022</span>
				</a>
				<a href="https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-28/">
					<span class="chapternum">Chapter 28</span>
					<span class="chapterdate">July 27, 2022</span>
				</a>
				<a href="https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/">
					<span class="chapternum">Chapter 27</span>
					<span class="chapterdate">July 19, 2022</span>
				</a>
			</div>
			`);
		const result = scraperService.parseChapterList($, "asura");
		expect(result).toBeInstanceOf(Set);
		expect(Array.from(result)).toContainEqual(expect.any(Map));
		expect(mapToObject(Array.from(result)[0])).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				ChapterNumber: expect.any(String),
				ChapterDate: expect.any(String),
				ChapterUrl: expect.any(String),
				ScrapeDate: expect.any(String),
			})
		);
	});

	test("parseChapter for realm provider returns expected values", () => {
		const $ = cheerio.load(`
			<link rel="canonical" href="https://realmscans.com/infinite-level-up-in-murim-chapter-123/" />
			<link rel="shortlink" href="https://realmscans.com/?p=1234/" />
			<div class="allc"><a href="https://realmscans.com/series/infinite-level-up-in-murim/">Infinite Level up in Murim</a></div>
			<h1 class="entry-title" itemprop="name">Infinite Level up in Murim Chapter 123</h1>
			<div id="readerarea">
				<noscript>
					<p>
						<img src="https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-119-00.webp" alt="" width="900" height="632" class="aligncenter size-full wp-image-2717" />
					</p>
					<p>
						<img loading="lazy" src="https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-1.webp" alt="" width="900" height="6112" class="aligncenter size-full wp-image-2718" />
					</p>
					<p>
						<img loading="lazy" src="https://s2.rwmert.space/2022/07/infinite-level-up-in-murim-chapter-123-2.webp" alt="" width="900" height="4705" class="aligncenter size-full wp-image-2719" />
					</p>
				</noscript>
			</div>
			`);
		const result = scraperService.parseChapter($, "realm");
		expect(result).toBeInstanceOf(Map);
		expect(mapToObject(result)).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				ChapterTitle: expect.any(String),
				ChapterShortUrl: expect.any(String),
				ChapterCanonicalUrl: expect.any(String),
				ChapterContent: expect.any(Array),
				ScrapeDate: expect.any(String),
			})
		);
	});

	test("parseChapter for other provider returns expected values", () => {
		const $ = cheerio.load(`
			<link rel="canonical" href="https://www.asurascans.com/chronicles-of-the-martial-gods-return-chapter-27-2/" />
			<link rel="shortlink" href="https://www.asurascans.com/?p=1234/" />
			<div class="allc"><a href="https://www.asurascans.com/manga/chronicles-of-the-martial-gods-return/">Chronicles Of The Martial God’s Return</a></div>
			<h1 class="entry-title" itemprop="name">Chronicles Of The Martial God’s Return Chapter 27</h1>
			<div id="readerarea" class="rdminimal">
				<p>
					<img src="https://www.asurascans.com/wp-content/uploads/2022/07/00-277.jpg" alt="" width="1200" height="800" class="alignnone size-full wp-image-113777" />
				</p>
				<p>
					<img loading="lazy" src="https://www.asurascans.com/wp-content/uploads/2022/07/01-221.jpg" alt="" width="800" height="12222" class="alignnone size-full wp-image-113778" />
				</p>
				<p>
					<img loading="lazy" src="https://www.asurascans.com/wp-content/uploads/2022/07/02-219.jpg" alt="" width="800" height="12222" class="alignnone size-medium wp-image-113779" />
				</p>
			</div>
			`);
		const result = scraperService.parseChapter($, "asura");
		expect(result).toBeInstanceOf(Map);
		expect(mapToObject(result)).toEqual(
			expect.objectContaining({
				EntryId: expect.any(String),
				EntrySlug: expect.any(String),
				ChapterTitle: expect.any(String),
				ChapterShortUrl: expect.any(String),
				ChapterCanonicalUrl: expect.any(String),
				ChapterContent: expect.any(Array),
				ScrapeDate: expect.any(String),
			})
		);
	});
})

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
			expect(result).toBeInstanceOf(Error);
		} catch (error) {
			expect(error.message).toBe(`Failed to crawl '${urlString}'`);
			expect(error.cause).not.toEqual(200);
		}
	}, 15000);
});
