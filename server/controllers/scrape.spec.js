import { getMockReq, getMockRes } from "@jest-mock/express";
import { jest } from "@jest/globals";
import scrapeMangaList from "./scrape";
import scraper from "../services/scraper";
import db from "../db";

jest.mock("../services/scraper");
jest.mock("../db");

describe("Unit test", () => {
	const { res, clearMockRes } = getMockRes();
	beforeEach(() => {
		clearMockRes();
		jest.restoreAllMocks();
	});

	describe("scrapeMangaList behaviour", () => {
		test("Request with valid body ---> processed with status 202", async () => {
			const expectedUrlString = "https://www.asurascans.com/manga/list-mode/";
			const scraperSpy = scraper.mockImplementation(() => {
				const result = new Set();
				result.add(new Map([["Id", "This is a test entry 1"]]));
				result.add(new Map([["Id", "This is a test entry 2"]]));
				result.add(new Map([["Id", "This is a test entry 3"]]));
				return result;
			});
			const createStatusSpy = db.createStatus.mockImplementation();
			const getEntrySpy = db.getEntry.mockImplementation(() => null);
			const createEntrySpy = db.createEntry.mockImplementation();
			const updateStatusSpy = db.updateStatus.mockImplementation();

			const req = getMockReq({ body: { provider: "asura" } });
			await scrapeMangaList(req, res);

			expect(scraperSpy).toHaveBeenCalled();
			expect(scraperSpy).toHaveBeenCalledWith(
				expectedUrlString,
				"MangaList",
				"asura"
			);

			expect(createStatusSpy).toHaveBeenCalledTimes(1);
			expect(createStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({ RequestStatus: "pending" })
			);

			expect(getEntrySpy).toHaveBeenCalledTimes(3);
			expect(getEntrySpy).toHaveReturnedWith(null);

			expect(createEntrySpy).toHaveBeenCalledTimes(3);
			expect(createEntrySpy).toHaveBeenCalledWith(expect.any(Object));

			expect(updateStatusSpy).toHaveBeenCalledTimes(1);
			expect(updateStatusSpy).toHaveBeenCalledWith(
				expect.objectContaining({ RequestStatus: "completed" })
			);

			expect(res.status).toHaveBeenCalledWith(202);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: expect.any(Number),
					statusText: expect.any(String),
					data: {
						requestId: expect.any(String),
						requestType: expect.any(String),
					},
				})
			);
		});
	});
});
