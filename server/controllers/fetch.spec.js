import { getMockReq, getMockRes } from "@jest-mock/express";
import { jest } from "@jest/globals";
import {
	fetchStatus,
	fetchProviderList,
	fetchListData,
	fetchMangaData,
	fetchChapterData,
} from "./fetch";
import db from "../db";

jest.mock("../db");
jest.mock("../services/logger");

describe("Unit test", () => {
	const { res, clearMockRes } = getMockRes();
	beforeEach(() => {
		clearMockRes();
		jest.clearAllMocks();
	});

	describe("fetchStatus behaviour", () => {
		test("UUID exists in the database --> 200", async () => {
			const req = getMockReq({
				params: { id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5" },
			});
			const expectedResult = {
				EntryId: "request-status",
				EntrySlug: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5",
				FailedItems: [
					"Already exist in the database: 'battle-of-the-six-realms'",
					"Already exist in the database: 'berserk-of-gluttony'",
				],
				RequestStatus: "completed",
			};
			const getEntrySpy = db.getEntry.mockImplementation(() => expectedResult);
			await fetchStatus(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 200,
					statusText: "OK",
					data: expectedResult,
				})
			);
		});

		test("UUID does not exist in the database --> 404", async () => {
			const req = getMockReq({
				params: { id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => false);
			await fetchStatus(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 404,
					statusText: expect.any(String),
				})
			);
		});

		test("Error occurs on the server/database --> 500", async () => {
			const req = getMockReq({
				params: { id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => {
				throw new Error("This is just a test");
			});
			await fetchStatus(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 500,
					statusText: expect.any(String),
				})
			);
		});
	});

	describe("fetchProviderList behaviour", () => {
		test("UUID exists in the database --> 200", async () => {
			const req = getMockReq();
			await fetchProviderList(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 200,
					statusText: "OK",
					data: expect.any(Array),
				})
			);
		});
	});

	describe("fetchListData behaviour", () => {
		test("EntryId exists in the database --> 200", async () => {
			const req = getMockReq({
				params: { provider: "asura" },
			});
			const expectedResult = [
				{
					EntryId: "manga_asura",
					MangaTitle: "A Comic Artist’s Survival Guide",
					EntrySlug: "a-comic-artists-survival-guide",
					MangaUrl: "https://www.asurascans.com/manga/1660333069-a-comic-artists-survival-guide/",
					ScrapeDate: "Sun, 14 Aug 2022 04:19:34 GMT",
				},
				{
					EntryId: "manga_asura",
					MangaTitle: "Above the Heavens",
					EntrySlug: "above-the-heavens",
					MangaUrl: "https://www.asurascans.com/manga/1660333069-above-the-heavens/",
					ScrapeDate: "Sun, 14 Aug 2022 04:19:34 GMT",
				},
			];
			const getCollectionSpy = db.getCollection.mockImplementation(() => expectedResult);
			await fetchListData(req, res);
			expect(getCollectionSpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 200,
					statusText: "OK",
					data: expectedResult,
				})
			);
		});

		test("EntryId does not exist in the database --> 404", async () => {
			const req = getMockReq({
				params: { provider: "hello" },
			});
			const getCollectionSpy = db.getCollection.mockImplementation(() => false);
			await fetchListData(req, res);
			expect(getCollectionSpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 404,
					statusText: expect.any(String),
				})
			);
		});

		test("Error occurs on the server/database --> 500", async () => {
			const req = getMockReq({
				params: { provider: "asura" },
			});
			const getCollectionSpy = db.getCollection.mockImplementation(() => {
				throw new Error("This is just a test");
			});
			await fetchListData(req, res);
			expect(getCollectionSpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 500,
					statusText: expect.any(String),
				})
			);
		});
	});

	describe("fetchMangaData behaviour", () => {
		test("EntryId and EntrySlug exist in the database --> 200", async () => {
			const req = getMockReq({
				params: { provider: "asura", slug: "a-returners-magic-should-be-special" },
			});
			const expectedResult = {
				EntryId: "manga_luminous",
				MangaTitle: "A Returner’s Magic Should Be Special",
				MangaCover: "https://luminousscans.com/wp-content/uploads/2022/06/resource.png",
				MangaShortUrl: "https://luminousscans.com/?p=41295",
				EntrySlug: "a-returners-magic-should-be-special",
				MangaUrl: "https://luminousscans.com/series/a-returners-magic-should-be-special/",
				MangaSynopsis: "For 10 years, magical prodigy Desir and his party have been battling inside the mysterious Shadow Labyrinth—and against the end of the world. Much of humanity has already perished and just as Desir is about to be killed, he’s sent back 13 years into the past. Despite knowing the cursed future that lies ahead, Desir steels his resolve as he sees an opportunity to train his friends and better prepare to face Armageddon together, without losing the ones they love!",
				MangaCanonicalUrl: "https://luminousscans.com/series/a-returners-magic-should-be-special/",
				ScrapeDate: "Sun, 14 Aug 2022 03:05:09 GMT",
			};
			const getEntrySpy = db.getEntry.mockImplementation(() => expectedResult);
			await fetchMangaData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 200,
					statusText: "OK",
					data: expectedResult,
				})
			);
		});

		test("EntryId and EntrySlug do not exist in the database --> 404", async () => {
			const req = getMockReq({
				params: { provider: "asura", slug: "a-returners-magic-should-be-special" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => false);
			await fetchMangaData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 404,
					statusText: expect.any(String),
				})
			);
		});

		test("Error occurs on the server/database --> 500", async () => {
			const req = getMockReq({
				params: { provider: "asura", slug: "a-returners-magic-should-be-special" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => {
				throw new Error("This is just a test");
			});
			await fetchMangaData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 500,
					statusText: expect.any(String),
				})
			);
		});
	});

	describe("fetchChapterData behaviour", () => {
		test("EntryId and EntrySlug exist in the database --> 200", async () => {
			const req = getMockReq({
				params: { provider: "asura", manga: "a-returners-magic-should-be-special", slug: "a-returners-magic-should-be-special-chapter-1" },
			});
			const expectedResult = {
				EntryId: "chapter_luminous_a-returners-magic-should-be-special",
				ChapterContent: [
					"https://luminousscans.com/wp-content/uploads/2022/07/01.jpg",
					"https://luminousscans.com/wp-content/uploads/2022/07/02.jpg",
					"https://luminousscans.com/wp-content/uploads/2022/07/03.jpg",
				],
				EntrySlug: "a-returners-magic-should-be-special-chapter-1",
				ChapterShortUrl: "https://luminousscans.com/?p=42041",
				ChapterTitle: "A Returner’s Magic Should Be Special Chapter 1",
				ChapterCanonicalUrl: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/",
				ChapterDate: "June 28, 2022",
				ChapterNumber: "Chapter 1",
				ChapterUrl: "https://luminousscans.com/a-returners-magic-should-be-special-chapter-1/",
				ScrapeDate: "Sun, 14 Aug 2022 03:12:37 GMT",
			};
			const getEntrySpy = db.getEntry.mockImplementation(() => expectedResult);
			await fetchChapterData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 200,
					statusText: "OK",
					data: expectedResult,
				})
			);
		});

		test("EntryId and EntrySlug do not exist in the database --> 404", async () => {
			const req = getMockReq({
				params: { provider: "asura", manga: "a-returners-magic-should-be-special", slug: "a-returners-magic-should-be-special-chapter-1" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => false);
			await fetchChapterData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 404,
					statusText: expect.any(String),
				})
			);
		});

		test("Error occurs on the server/database --> 500", async () => {
			const req = getMockReq({
				params: { provider: "asura" },
			});
			const getEntrySpy = db.getEntry.mockImplementation(() => {
				throw new Error("This is just a test");
			});
			await fetchChapterData(req, res);
			expect(getEntrySpy).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 500,
					statusText: expect.any(String),
				})
			);
		});
	});
});

describe("Integration test", () => {});
