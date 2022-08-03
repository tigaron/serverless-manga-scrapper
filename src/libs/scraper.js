import * as cheerio from "cheerio";
import logger from "./logger.js";
import crawler from "./crawler.js";

const load = async (html) => {
    try {
        return cheerio.load(html);
    } catch (error) {
        return error;
    }
}

const parse = async ($, type, isRealm) => {
    let result;
    try {
        switch (type) {
            case "list":
                result = [];
                for (const element of $("a.series", "div.soralist")) {
                    const item = {};
                    item.title = $(element).text().trim() + "";
                    item.url = $(element).attr("href");
                    item.slug = item.url.split("/").slice(-3, -1).join("+")
                    result.push(item);
                };
                break;
            case "manga":
                result = {};
                result.title = $("h1.entry-title").text().trim() + "";
                result.cover = $("img", "div.thumb").attr("src");
                result.synopsis = $("p", "div.entry-content").text();
                result.chapters = [];
                for (const element of $("a", "div.eplister")) {
                    const item = {};
                    item.title = $("span.chapternum", element).text();
                    if (item.title.includes("\n")) {
                        item.title = item.title.split("\n").slice(-2).join(" ");
                    }
                    item.url = $(element).attr("href");
                    item.slug = item.url.split("/").slice(-2).shift();
                    result.chapters.push(item);
                };
                break;
            case "chapter":
                result = {};
                result.title = $("h1.entry-title").text().trim() + "";
                result.img = [];
                if (!isRealm) {
                    for (const element of $("img[class*='wp-image']", "div#readerarea")) {
                        result.img.push($(element).attr("src"));
                    };
                } else {
                    const realmContent = $("div#readerarea").contents().text();
                    for (const element of $("img[class*='wp-image']", realmContent)) {
                        result.img.push($(element).attr("src"));
                    };
                }
                break;
        }
        return result;
    } catch (error) {
        return error;
    }
}

const scraper = async (url, type, isRealm) => {
    try {
        const html = await crawler(url)
        if (typeof(html) !== "string") {
            return html;
        } else {
            const $ = await load(html);
            logger.info(`Start scraping '${type}'`);
            const result = await parse($, type, isRealm);
            return result;
        }
    } catch (error) {
        return error;
    }
}

export default scraper;
