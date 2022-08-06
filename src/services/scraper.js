import * as cheerio from "cheerio";
import logger from "./logger.js";
import crawler from "./crawler.js";
import { parseList, parseManga, parseChapter } from "./parser.js";

const load = (html) => cheerio.load(html);

const scraper = async (url, type, isRealm) => {
	try {
		logger.info(`Scrape start: '${url}'`);
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
		logger.info(`Scrape success: '${url}'`);
		return result;
	} catch (error) {
		logger.debug(`Scrape fail: '${url}'`);
		return error;
	}
};

export default scraper;
