import scraper from "./scraper.js";

describe("Test scraper service", () => {
	test("Scraping manga list data", async () => {
		const result = await scraper("https://www.asurascans.com/manga/list-mode/", "list", "asura");
		expect(result).toBeTruthy();
	});
});