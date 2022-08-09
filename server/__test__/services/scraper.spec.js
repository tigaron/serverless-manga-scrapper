import { crawlService } from "../../services/crawler.js";
import { scraper } from "../../services/scraper.js";
import { jest } from "@jest/globals";
import * as cheerio from "cheerio";

describe("Test scraper service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	test("Crawler service should be called with url", async () => {
		const crawlerSpy = jest.spyOn(crawlService, "crawler");
		await scraper("https://www.asurascans.com/manga/list-mode/");
		expect(crawlerSpy).toHaveBeenCalledWith("https://www.asurascans.com/manga/list-mode/");
	});
	test("Cheerio should load with HTML string", async () => {
		const cheerioSpy = jest.spyOn(cheerio, "load");
		await scraper("https://www.asurascans.com/manga/list-mode/");
		expect(cheerioSpy).toHaveBeenCalledWith(expect.stringMatching(/DOCTYPE html/));
	});
});