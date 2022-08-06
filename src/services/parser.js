import logger from "./logger.js";

export const parseList = ($) => {
	const result = [];
	logger.info(`Parse start: list data`);
	for (const element of $("a.series", "div.soralist")) {
		const item = {};
		item.title = $(element).text().trim() + "";
		item.url = $(element).attr("href");
		item.slug = item.url.split("/").slice(-3, -1).join("+");
		result.push(item);
	}
	logger.info(`Parse end: list data`);
	return result;
};

export const parseManga = ($) => {
	logger.info(`Parse start: manga data`);
	const result = {};
	result.title = $("h1.entry-title").text().trim() + "";
	result.cover = $("img", "div.thumb").attr("src");
	result.synopsis = $("p", "div.entry-content").text();
	result.chapters = [];
	for (const element of $("a", "div.eplister")) {
		const item = {};
		item.title = $("span.chapternum", element).text();
		if (item.title.includes("\n"))
			item.title = item.title.split("\n").slice(-2).join(" ");
		item.url = $(element).attr("href");
		item.slug = item.url.split("/").slice(-2).shift();
		result.chapters.push(item);
	}
	logger.info(`Parse end: manga data`);
	return result;
};

export const parseChapter = ($, isRealm) => {
	logger.info(`Parse start: chapter data`);
	const result = {};
	result.title = $("h1.entry-title").text().trim() + "";
	result.img = [];
	if (!isRealm) {
		for (const element of $("img[class*='wp-image']", "div#readerarea")) {
			result.img.push($(element).attr("src"));
		}
	} else {
		const realmContent = $("div#readerarea").contents().text();
		for (const element of $("img[class*='wp-image']", realmContent)) {
			result.img.push($(element).attr("src"));
		}
	}
	logger.info(`Parse end: chapter data`);
	return result;
};