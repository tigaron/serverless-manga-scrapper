import crawler from "../../../src/services/crawler.js";

describe("Test crawler service", () => {
	test("Valid requested url --> return HTML string document", async () => {
		const url = "https://google.com/";
		const result = await crawler(url);
		expect(typeof result).toBe("string");
		expect(result).toMatch(/DOCTYPE html/);
	});
	test("Invalid requested url --> return error", async () => {
		const url = "https://google.com/test";
		const result = await crawler(url);
		expect(result).toBeInstanceOf(Error);
	});
});
