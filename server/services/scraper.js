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
		if (!response.ok()) throw new Error(`Failed to fetch '${urlString}`);
		return await page.content();
	} catch (error) {
		return error;
	} finally {
		await browser.close();
	}
}

function loadHTML(htmlString) {
	return cheerio.load(htmlString);
}

function parseList($, mangaProvider) {
	const result = new Set();
	$("a.series", "div.soralist").each((index, element) => {
		const MangaTitle = $(element).text().trim();
		const MangaUrl = $(element).attr("href");
		const [MangaType, MangaSlug] = MangaUrl.split("/").slice(-3, -1);
		const MangaProvider = mangaProvider;
		const manga = new Map([
			["MangaProvider", MangaProvider],
			["MangaTitle", MangaTitle],
			["MangaSlug", MangaSlug],
			["MangaType", MangaType],
			["MangaUrl", MangaUrl],
		]);
		result.add(manga);
	});
	return result;
}

function parseManga($, mangaProvider) {
	const MangaTitle = $("h1.entry-title").text().trim();
	const MangaSynopsis = $("p", "div.entry-content").text();
	const MangaCover = $("img", "div.thumb").attr("src");
	const MangaUrl = $("link[rel='canonical']").attr("href");
	const [MangaType, MangaSlug] = MangaUrl.split("/").slice(-3, -1);
	const MangaProvider = mangaProvider;
	const manga = new Map([
		["MangaProvider", MangaProvider],
		["MangaTitle", MangaTitle],
		["MangaSlug", MangaSlug],
		["MangaType", MangaType],
		["MangaUrl", MangaUrl],
		["MangaCover", MangaCover],
		["MangaSynopsis", MangaSynopsis],
	]);
	const chapterList = new Set();
	$("a", "div.eplister").each((index, element) => {
		const ChapterTitle = $("span.chapternum", element).text().includes("\n")
			? $("span.chapternum", element).text().trim().split("\n").slice(-2).join(" ")
			: $("span.chapternum", element).text().trim();
		const ChapterDate = $("span.chapterdate", element).text().includes("\n")
			? $("span.chapterdate", element).text().trim().split("\n").slice(-2).join(" ")
			: $("span.chapterdate", element).text().trim();
		const ChapterUrl = $(element).attr("href");
		const ChapterSlug = ChapterUrl.split("/").slice(-2).shift();
		const ChapterProvider = mangaProvider;
		const chapter = new Map([
			["ChapterProvider", ChapterProvider],
			["ChapterTitle", ChapterTitle],
			["ChapterSlug", ChapterSlug],
			["ChapterUrl", ChapterUrl],
			["ChapterDate", ChapterDate],
		]);
		chapterList.add(chapter);
	});
	const result = new Set([manga, chapterList]);
	return result;
}

function parseChapter($, mangaProvider) {
	const ChapterTitle = $("h1.entry-title").text().trim();
	const ChapterUrl = $("link[rel='canonical']").attr("href");
	const ChapterSlug = ChapterUrl.split("/").slice(-2).shift();
	const ChapterProvider = mangaProvider;
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
	const result = new Map([
		["ChapterProvider", ChapterProvider],
		["ChapterTitle", ChapterTitle],
		["ChapterSlug", ChapterSlug],
		["ChapterUrl", ChapterUrl],
		["ChapterContent", ChapterContent],
	]);
	return result;
}

async function scraper(urlString, requestType, mangaProvider) {
	try {
		const htmlString = await crawler(urlString);
		if (typeof htmlString !== "string")
			throw new Error(`No valid HTML string detected`);
		const $ = loadHTML(htmlString);
		const parserDictionary = {
			list: parseList($, mangaProvider),
			manga: parseManga($, mangaProvider),
			chapter: parseChapter($, mangaProvider)
		}
		const result = parserDictionary[requestType];
		logger.debug(`Scrape success: '${urlString}'`);
		return result;
	} catch (error) {
		logger.debug(`Scrape fail: '${urlString}'`);
		logger.debug(error.message);
		return error;
	}
}

export default scraper;
