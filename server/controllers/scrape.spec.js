import { getMockReq, getMockRes } from "@jest-mock/express";
import { jest } from "@jest/globals";
import {
	scrapeMangaList,
	scrapeManga,
	scrapeChapterList,
	scrapeChapter,
} from "./scrape";
import scraper from "../services/scraper";
import db from "../db";

jest.mock("../services/scraper");
jest.mock("../db");

describe("Unit test", () => {
	const { res, clearMockRes } = getMockRes();
	beforeEach(() => {
		clearMockRes();
		jest.clearAllMocks();
	});

	describe("scrapeMangaList behaviour", () => {
		test("Scraper return new data --> respond 202 --> process scraped data", async () => {
			const expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
			const scraperSpy = scraper.mockImplementation(() => {
				const result = new Set();
				result.add(new Map([ ["Id", "Entry 1"], ["MangaSlug", "This is a test entry 1"] ]));
				result.add(new Map([ ["Id", "Entry 2"], ["MangaSlug", "This is a test entry 2"] ]));
				result.add(new Map([ ["Id", "Entry 3"], ["MangaSlug", "This is a test entry 3"] ]));
				return result;
			});
			const createStatusSpy = db.createStatus.mockImplementation();
			const getEntrySpy = db.getEntry.mockImplementation(() => null);
			const createEntrySpy = db.createEntry.mockImplementation();
			const updateStatusSpy = db.updateStatus.mockImplementation();

			const req = getMockReq({ body: { provider: "asura" } });
			await scrapeMangaList(req, res);

			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"MangaList",
				"asura"
			);

			expect(createStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({ RequestStatus: "pending" })
			);

			expect(getEntrySpy).toHaveBeenCalledTimes(3);
			expect(getEntrySpy).toHaveReturnedWith(null);

			expect(createEntrySpy).toHaveBeenCalledTimes(3);
			expect(createEntrySpy).toHaveBeenCalledWith(expect.any(Object));

			expect(updateStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({ RequestStatus: "completed" })
			);

			expect(res.status).toHaveBeenCalledWith(202);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 202,
					statusText: expect.any(String),
					data: {
						requestId: expect.any(String),
						requestType: expect.any(String),
					},
				})
			);
		});

		test("Scraper return old data --> respond 202 --> inform old data", async () => {
			const expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
			const scraperSpy = scraper.mockImplementation(() => {
				const result = new Set();
				result.add(new Map([ ["Id", "Entry 1"], ["MangaSlug", "This is a test entry 1"] ]));
				result.add(new Map([ ["Id", "Entry 2"], ["MangaSlug", "This is a test entry 2"] ]));
				result.add(new Map([ ["Id", "Entry 3"], ["MangaSlug", "This is a test entry 3"] ]));
				return result;
			});
			const createStatusSpy = db.createStatus.mockImplementation();
			const getEntrySpy = db.getEntry.mockImplementation(() => {
				const data = {
					Id: "Entry",
					MangaSlug: "This is a test entry",
				};
				return data;
			});
			const createEntrySpy = db.createEntry.mockImplementation();
			const updateStatusSpy = db.updateStatus.mockImplementation();

			const req = getMockReq({ body: { provider: "asura" } });
			await scrapeMangaList(req, res);

			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"MangaList",
				"asura"
			);

			expect(createStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({ RequestStatus: "pending" })
			);

			expect(getEntrySpy).toHaveBeenCalledTimes(3);
			expect(getEntrySpy).toHaveReturnedWith(expect.any(Object));

			expect(createEntrySpy).not.toHaveBeenCalled();

			expect(updateStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					RequestStatus: "completed",
					FailedItems: expect.any(Array),
				})
			);

			expect(res.status).toHaveBeenCalledWith(202);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 202,
					statusText: expect.any(String),
					data: {
						requestId: expect.any(String),
						requestType: expect.any(String),
					},
				})
			);
		});

		test("Crawler/scraper failed to process request --> request aborted", async () => {
			const expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
			const scraperSpy = scraper.mockImplementation(() => {
				return Error("Failed to crawl 'urlString'", { cause: 404 });
			});
	
			const req = getMockReq({ body: { provider: "asura" } });
			await scrapeMangaList(req, res);
	
			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"MangaList",
				"asura"
			);
			expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
	
			expect(res.status).toHaveBeenCalledWith(expect.any(Number));
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: expect.any(Number),
					statusText: expect.any(String),
				})
			);
		});
	});

	describe("scrapeManga behaviour", () => {
		test("Scraper return new data --> process scraped data --> respond 201", async () => {
			const expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
			const scraperSpy = scraper.mockImplementation(() => {
				const result = new Map([
					["Id", `manga_luminous_a-returners-magic-should-be-special`],
					["MangaSlug", "a-returners-magic-should-be-special"],
					["MangaType", "series"],
					["MangaProvider", "luminous"]
				]);
				return result;
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => null);
			const createEntrySpy = db.createEntry.mockImplementation();

			const req = getMockReq({
				body: {
					provider: "luminous",
					type: "series",
					slug: "a-returners-magic-should-be-special",
				},
			});
			await scrapeManga(req, res);

			expect(getEntrySpy).toHaveReturnedWith(null);
			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"Manga",
				"luminous"
			);
			expect(createEntrySpy).toHaveBeenCalledWith(expect.any(Object));

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 201,
					statusText: "Created",
					data: expect.any(Object),
				})
			);
		});

		test("Scraper return old data --> respond 409", async () => {
			const expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
			const scraperSpy = scraper.mockImplementation(() => {
				const result = new Map([
					["Id", `manga_luminous_a-returners-magic-should-be-special`],
					["MangaSlug", "a-returners-magic-should-be-special"],
					["MangaType", "series"],
					["MangaProvider", "luminous"]
				]);
				return result;
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => {
				const data = {
					Id: "Entry",
					MangaSlug: "This is a test entry",
				};
				return data;
			});
			const createEntrySpy = db.createEntry.mockImplementation();

			const req = getMockReq({
				body: {
					provider: "luminous",
					type: "series",
					slug: "a-returners-magic-should-be-special",
				},
			});
			await scrapeManga(req, res);

			expect(getEntrySpy).toHaveReturnedWith(expect.any(Object));
			expect(createEntrySpy).not.toHaveBeenCalled();

			expect(res.status).toHaveBeenCalledWith(409);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 409,
					statusText: expect.any(String),
				})
			);
		});

		test("Crawler/scraper failed to process request --> request aborted", async () => {
			const expectedUrlString = "https://luminousscans.com/series/a-returners-magic-should-be-special/";
			const scraperSpy = scraper.mockImplementation(() => {
				return Error("Failed to crawl 'urlString'", { cause: 404 });
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => null);
	
			const req = getMockReq({
				body: {
					provider: "luminous",
					type: "series",
					slug: "a-returners-magic-should-be-special",
				},
			});
			await scrapeManga(req, res);

			expect(getEntrySpy).toHaveReturnedWith(null);
			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"Manga",
				"luminous"
			);
			expect(scraperSpy).toHaveReturnedWith(expect.any(Error));
	
			expect(res.status).toHaveBeenCalledWith(expect.any(Number));
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: expect.any(Number),
					statusText: expect.any(String),
				})
			);
		});
	});
});
