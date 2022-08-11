import chromium from "@sparticuz/chrome-aws-lambda";
import * as cheerio from "cheerio";
import logger from "./logger";

const crawler = async (url) => {
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
			const shouldAbort =
				request.resourceType() === "script" ||
				request.resourceType() === "font" ||
				request.resourceType() === "image" ||
				request.resourceType() === "xhr" ||
				request.resourceType() === "stylesheet" ||
				request.resourceType() === "media";

			if (shouldAbort) request.abort();
			else request.continue();
		});

		const response = await page.goto(url, { waitUntil: "domcontentloaded" });

		if (!response.ok()) throw new Error(`Failed to fetch '${url}`);

		const content = await page.content();
		logger.debug(`Crawl success: '${url}'`);
		return content;
	} catch (error) {
		logger.debug(`Crawl fail: '${url}'`);
		logger.debug(error.message);
		return error;
	} finally {
		await browser.close();
	}
};

const load = (html) => cheerio.load(html);

const parseList = ($) => {
	const result = [];
	for (const element of $("a.series", "div.soralist")) {
		const item = {};
		item.Title = $(element).text().trim() + "";
		item.Url = $(element).attr("href");
		item.Slug = item.Url.split("/").slice(-3, -1).join("+");
		result.push(item);
	}
	return result;
};

const parseManga = ($) => {
	const result = {};
	result.Title = $("h1.entry-title").text().trim() + "";
	result.Cover = $("img", "div.thumb").attr("src");
	result.Synopsis = $("p", "div.entry-content").text();
	result.Chapters = [];
	for (const element of $("a", "div.eplister")) {
		const item = {};
		item.Title = $("span.chapternum", element).text();
		if (item.Title.includes("\n"))
			item.Title = item.Title.split("\n").slice(-2).join(" ");
		item.Url = $(element).attr("href");
		item.Slug = item.Url.split("/").slice(-2).shift();
		result.Chapters.push(item);
	}
	return result;
};

const parseChapter = ($, isRealm) => {
	const result = {};
	result.Title = $("h1.entry-title").text().trim() + "";
	result.Content = [];
	if (!isRealm) {
		for (const element of $("img[class*='wp-image']", "div#readerarea")) {
			result.Content.push($(element).attr("src"));
		}
	} else {
		const realmContent = $("div#readerarea").contents().text();
		for (const element of $("img[class*='wp-image']", realmContent)) {
			result.Content.push($(element).attr("src"));
		}
	}
	return result;
};

const scraper = async (url, type, isRealm) => {
	try {
		const html = await crawler(url);
		if (typeof html !== "string")
			throw new Error(`No valid HTML string detected`);
		const $ = load(html);
		let result;
		switch (type) {
			case "list":
				result = parseList($);
				break;
			case "manga":
				result = parseManga($);
				break;
			case "chapter":
				result = parseChapter($, isRealm);
				break;
		}
		logger.debug(`Scrape success: '${url}'`);
		return result;
	} catch (error) {
		logger.debug(`Scrape fail: '${url}'`);
		logger.debug(error.message);
		return error;
	}
};

export default scraper;