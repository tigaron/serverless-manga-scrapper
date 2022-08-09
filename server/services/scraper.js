import * as cheerio from "cheerio";
import logger from "./logger";
import { crawlService } from "./crawler";

export const load = (html) => cheerio.load(html);

export const parseList = ($) => {
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

export const parseManga = ($) => {
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

export const parseChapter = ($, isRealm) => {
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

export const scraper = async (url, type, isRealm) => {
	try {
		const html = await crawlService.crawler(url);
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
		return result;
	} catch (error) {
		logger.debug(`Scrape fail: '${url}'`);
		logger.warn(error.message);
		return error;
	}
};

export const scrapeService = {
	load,
	parseList,
	parseManga,
	parseChapter,
	scraper,
};
