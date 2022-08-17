import chromium from "@sparticuz/chrome-aws-lambda";
import * as cheerio from "cheerio";
import logger from "./logger";

async function crawler(urlString) {
	const browser = await chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: true,
	});
	try {
		const page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0"
		);
		await page.setRequestInterception(true);
		page.on("request", (request) => {
			if (request.resourceType() !== "document") request.abort();
			else request.continue();
		});
		const response = await page.goto(urlString, {
			waitUntil: "domcontentloaded",
		});
		if (!response.ok())
			throw new Error(`Failed to crawl '${urlString}'`, {
				cause: response.status(),
			});
		return await page.content();
	} catch (error) {
		throw error;
	} finally {
		await browser.close();
	}
}

function loadHTML(htmlString) {
	if (htmlString.constructor === Error) throw htmlString;
	return cheerio.load(htmlString);
}

function parseMangaList($, mangaProvider) {
	const MangaList = new Set();
	$("a.series", "div.soralist").each((index, element) => {
		const MangaTitle = $(element).text().trim();
		const MangaUrl = $(element).attr("href");
		const MangaSlug = MangaUrl.split("/").slice(-2).shift().replace(/[\d]*[-]?/, "");
		const timestamp = new Date().toUTCString();
		const Manga = new Map([
			["EntryId", `manga_${mangaProvider}`],
			["EntrySlug", MangaSlug],
			["MangaTitle", MangaTitle],
			["MangaUrl", MangaUrl],
			["ScrapeDate", timestamp],
		]);
		MangaList.add(Manga);
	});
	return MangaList;
}

function parseManga($, mangaProvider) {
	const MangaTitle = $("h1.entry-title").text().trim();
	let MangaSynopsis = $("p", "div.entry-content").text();
	if (!MangaSynopsis) MangaSynopsis = $("div.entry-content").contents().text();
	const MangaCover = $("img", "div.thumb").attr("src");
	const MangaShortUrl = $("link[rel='shortlink']").attr("href");
	const MangaCanonicalUrl = $("link[rel='canonical']").attr("href");
	const MangaSlug = MangaCanonicalUrl.split("/").slice(-2).shift().replace(/[\d]*[-]?/, "");
	const timestamp = new Date().toUTCString();
	const Manga = new Map([
		["EntryId", `manga_${mangaProvider}`],
		["EntrySlug", MangaSlug],
		["MangaTitle", MangaTitle],
		["MangaSynopsis", MangaSynopsis],
		["MangaCover", MangaCover],
		["MangaShortUrl", MangaShortUrl],
		["MangaCanonicalUrl", MangaCanonicalUrl],
		["ScrapeDate", timestamp],
	]);
	return Manga;
}

function parseChapterList($, mangaProvider) {
	const MangaSlug = $("link[rel='canonical']").attr("href").split("/").slice(-2).shift().replace(/[\d]*[-]?/, "");
	const ChapterList = new Set();
	$("a", "div.eplister").each((index, element) => {
		let ChapterNumber = $("span.chapternum", element).text().trim();
		if(ChapterNumber.includes("\n")) ChapterNumber = ChapterNumber.split("\n").slice(-2).join(" ");
		const ChapterDate = $("span.chapterdate", element).text().trim();
		const ChapterOrder = $(element).parents("li").data("num");
		const ChapterUrl = $(element).attr("href");
		const ChapterSlug = ChapterUrl.split("/").slice(-2).shift().replace(/[\d]*[-]?/, "");
		const timestamp = new Date().toUTCString();
		const Chapter = new Map([
			["EntryId", `chapter_${mangaProvider}_${MangaSlug}`],
			["EntrySlug", ChapterSlug],
			["ChapterOrder", ChapterOrder],
			["ChapterNumber", ChapterNumber],
			["ChapterUrl", ChapterUrl],
			["ChapterDate", ChapterDate],
			["ScrapeDate", timestamp],
		]);
		ChapterList.add(Chapter);
	});
	return ChapterList;
}

function parseChapter($, mangaProvider) {
	const ChapterTitle = $("h1.entry-title").text().trim();
	const ChapterShortUrl = $("link[rel='shortlink']").attr("href");
	let ChapterCanonicalUrl = $("link[rel='canonical']").attr("href");
	if (!ChapterCanonicalUrl) ChapterCanonicalUrl = $("meta[property='og:url']").attr("content");
	const ChapterSlug = ChapterCanonicalUrl.split("/").slice(-2).shift().replace(/[\d]*[-]?/, "");
	const navScript = $("script:contains('ts_reader.run')").contents().text();
	const ChapterPrevSlug = navScript.match(/"prevUrl":"(.*?)"/)[1].split("/").slice(-2).shift().replace(/[\d]*[-]?/, "").replace(/\\/, "");
	const ChapterNextSlug = navScript.match(/"nextUrl":"(.*?)"/)[1].split("/").slice(-2).shift().replace(/[\d]*[-]?/, "").replace(/\\/, "");
	const timestamp = new Date().toUTCString();
	const ChapterContent = new Set();
	if (mangaProvider === "realm") {
		const realmContent = $("div#readerarea").contents().text();
		$("img[class*='wp-image']", realmContent).each((index, element) => {
			const img = $(element).attr("src");
			ChapterContent.add(img);
		});
	} else {
		$("img[class*='wp-image']", "div#readerarea").each((index, element) => {
			const img = $(element).attr("src");
			ChapterContent.add(img);
		});
	}
	if (!ChapterContent.size) {
		$("img[class*='size-full']", "div#readerarea").each((index, element) => {
			const img = $(element).attr("src");
			ChapterContent.add(img);
		});
	}
	const Chapter = new Map([
		["EntryId", mangaProvider],
		["EntrySlug", ChapterSlug],
		["ChapterTitle", ChapterTitle],
		["ChapterShortUrl", ChapterShortUrl],
		["ChapterCanonicalUrl", ChapterCanonicalUrl],
		["ChapterPrevSlug", ChapterPrevSlug],
		["ChapterNextSlug", ChapterNextSlug],
		["ChapterContent", ChapterContent],
		["ScrapeDate", timestamp],
	]);
	return Chapter;
}

export default async function scraper(urlString, requestType, mangaProvider) {
	try {
		const htmlString = await crawler(urlString);
		const $ = loadHTML(htmlString);
		let result;
		switch (requestType) {
			case "MangaList":
				result = parseMangaList($, mangaProvider);
				break;
			case "Manga":
				result = parseManga($, mangaProvider);
				break;
			case "ChapterList":
				result = parseChapterList($, mangaProvider);
				break;
			case "Chapter":
				result = parseChapter($, mangaProvider);
				break;
		}
		logger.debug(`Scraper success: ${requestType} - ${urlString}`);
		return result;
	} catch (error) {
		logger.warn(`Scraper fail: ${requestType} - ${urlString}`);
		return error;
	}
}

export {
	crawler,
	loadHTML,
	parseMangaList,
	parseManga,
	parseChapterList,
	parseChapter,
};
