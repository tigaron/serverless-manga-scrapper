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
	const timestamp = new Date();
	const result = new Map([
		["Id", `manga-list_${mangaProvider}`],
		["UpdatedAt", timestamp.toUTCString()],
	]);
	const MangaList = new Map();
	$("a.series", "div.soralist").each((index, element) => {
		const MangaTitle = $(element).text().trim();
		const MangaUrl = $(element).attr("href");
		const [MangaType, MangaSlug] = MangaUrl.split("/").slice(-3, -1);
		const MangaDetail = new Map([
			["MangaTitle", MangaTitle],
			["MangaSlug", MangaSlug],
			["MangaType", MangaType],
			["MangaUrl", MangaUrl],
		]);
		MangaList.set(MangaSlug, MangaDetail);
	});
	result.set("MangaList", MangaList)
	return result;
}

function parseManga($, mangaProvider) {
	const MangaTitle = $("h1.entry-title").text().trim();
	const MangaSynopsis = $("p", "div.entry-content").text();
	const MangaCover = $("img", "div.thumb").attr("src");
	const MangaUrl = $("link[rel='canonical']").attr("href");
	const [MangaType, MangaSlug] = MangaUrl.split("/").slice(-3, -1);
	const MangaProvider = mangaProvider;
	const timestamp = new Date();
	const result = new Map([
		["Id", `manga_${MangaProvider}_${MangaSlug}`],
		["MangaTitle", MangaTitle],
		["MangaSlug", MangaSlug],
		["MangaType", MangaType],
		["MangaProvider", MangaProvider],
		["MangaUrl", MangaUrl],
		["MangaCover", MangaCover],
		["MangaSynopsis", MangaSynopsis],
		["UpdatedAt", timestamp.toUTCString()],
	]);
	return result;
}

function parseChapterList($, mangaProvider) {
	const timestamp = new Date();
	const MangaSlug = $("link[rel='canonical']")
		.attr("href")
		.split("/")
		.slice(-3, -1)
		.pop();
	const result = new Map([
		["Id", `chapter-list_${mangaProvider}_${MangaSlug}`],
		["UpdatedAt", timestamp.toUTCString()],
	]);
	const ChapterList = new Map();
	$("a", "div.eplister").each((index, element) => {
		const ChapterTitle = $("span.chapternum", element).text().includes("\n")
			? $("span.chapternum", element)
					.text()
					.trim()
					.split("\n")
					.slice(-2)
					.join(" ")
			: $("span.chapternum", element).text().trim();
		const ChapterDate = $("span.chapterdate", element).text().trim();
		const ChapterUrl = $(element).attr("href");
		const ChapterSlug = ChapterUrl.split("/").slice(-2).shift();
		const ChapterDetail = new Map([
			["ChapterTitle", ChapterTitle],
			["ChapterSlug", ChapterSlug],
			["ChapterUrl", ChapterUrl],
			["ChapterDate", ChapterDate],
		]);
		ChapterList.set(ChapterSlug, ChapterDetail);
	});
	result.set("ChapterList", ChapterList);
	return result;
}

function parseChapter($, mangaProvider) {
	const ChapterTitle = $("h1.entry-title").text().trim();
	const ChapterUrl = $("link[rel='canonical']").attr("href");
	const ChapterSlug = ChapterUrl.split("/").slice(-2).shift();
	const ChapterProvider = mangaProvider;
	const timestamp = new Date();
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
		["Id", `chapter_${ChapterProvider}_${ChapterSlug}`],
		["ChapterTitle", ChapterTitle],
		["ChapterSlug", ChapterSlug],
		["ChapterProvider", ChapterProvider],
		["ChapterUrl", ChapterUrl],
		["ChapterContent", ChapterContent],
		["UpdatedAt", timestamp.toUTCString()],
	]);
	return result;
}

export default async function scraper(urlString, requestType, mangaProvider) {
	try {
		const htmlString = await crawler(urlString);
		const $ = loadHTML(htmlString);
		const parserDictionary = {
			MangaList: parseMangaList($, mangaProvider),
			Manga: parseManga($, mangaProvider),
			ChapterList: parseChapterList($, mangaProvider),
			Chapter: parseChapter($, mangaProvider),
		};
		const result = parserDictionary[requestType];
		logger.debug(`Scraper success: ${requestType} - ${urlString}`);
		return result;
	} catch (error) {
		logger.warn(`Scraper fail: ${requestType} - ${urlString}`);
		throw error;
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
