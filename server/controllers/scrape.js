import { v4 as uuidv4 } from "uuid";
import scraper from "../services/scraper";
import logger from "../services/logger";
import providerList from "../utils/providerList";
import mapToObject from "../utils/mapToObject";
import db from "../db";

/*
Function to scrape manga list from a specific manga provider
Example:
path: /scrape/manga-list
body: { provider: "asura" }
*/
async function mangaList(req, res) {
	const { provider: MangaProvider } = req.body;
	const urlString = providerList.get(MangaProvider);
	let jsonResponse;
	try {
		/*
		Try to scrape manga provider's website
		Return immediately if error
		*/
		const response = await scraper(urlString, "MangaList", MangaProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(mapToObject(jsonResponse));
		}

		/*
		Give 202 response before processing scraped data
		Inform the requestId, so it can be checked later on
		*/
		const requestId = uuidv4();
		const requestStatus = new Map([
			["EntryId", "request-status"],
			["EntrySlug", requestId],
			["RequestType", `manga-list_${MangaProvider}`],
			["RequestStatus", "pending"],
		]);
		await db.createStatus(mapToObject(requestStatus));
		jsonResponse = new Map([
			["status", 202],
			["statusText", "Processing request..."],
			["data", { requestId: requestId, requestType: `manga-list_${MangaProvider}` }],
		]);
		res.status(202).json(mapToObject(jsonResponse));
		
		/*
		Add each element of scraped manga list to database
		Skip if already exist in the database
		*/
		const failedItems = new Set();
		for await (const element of response) {
			const data = await db.getEntry(element.get("EntryId"), element.get("EntrySlug"));
			if (data) {
				failedItems.add(`Already exist in the database: '${element.get("EntrySlug")}'`);
				continue;
			} else {
				await db.createEntry(mapToObject(element));
			}
		}

		/*
		Update request status in the database
		Add information of skipped item if any
		*/
		const updatedStatus = new Map([
			["EntryId", "request-status"],
			["EntrySlug", requestId],
			["RequestStatus", "completed"],
			["FailedItems", Array.from(failedItems)],
		]);
		await db.updateStatus(mapToObject(updatedStatus));
	} catch (error) {
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
}

/*
Function to scrape a specific manga from a specific provider
Example:
path: /scrape/manga
body: { provider: "asura", slug: "damn-reincarnation" }
*/
async function manga(req, res) {
	const { provider: MangaProvider, slug: MangaSlug } = req.body;
	let jsonResponse;
	try {
		/*
		Try to check database
		Return immediately if other than initial data exist in the database
		Return immediately if nothing exist in the database
		*/
		const { MangaUrl: urlString, MangaCover } = await db.getEntry(`manga_${MangaProvider}`, MangaSlug);
		if (MangaCover) {
			jsonResponse = new Map([
				["status", 409],
				["statusText", `Already exist in the database: '${MangaSlug}'`],
			]);
			return res.status(409).json(mapToObject(jsonResponse));
		}
		if (!urlString) {
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find initial data for '${MangaSlug}', try to scrape manga-list first`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		}

		/*
		Try to scrape manga provider's website
		Return immediately if error
		*/
		const response = await scraper(urlString, "Manga", MangaProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(mapToObject(jsonResponse));
		}

		/*
		Add scraped data to the database
		Return with 201 response
		*/
		await db.updateMangaEntry(mapToObject(response));
		jsonResponse = new Map([
			["status", 201],
			["statusText", "Created"],
			["data", mapToObject(response)],
		]);
		return res.status(201).json(mapToObject(jsonResponse));
	} catch (error) {
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
}

/*
Function to scrape chapter list for a specific manga from a specific provider
Example:
path: /scrape/chapter-list
body: { provider: "asura", slug: "damn-reincarnation" }
*/
async function chapterList(req, res) {
	const { provider: MangaProvider, slug: MangaSlug } = req.body;
	let jsonResponse;
	try {
		/*
		Return immediately if not exist in the database
		*/
		const { MangaUrl: urlString } = await db.getEntry(`manga_${MangaProvider}`, MangaSlug);
		if (!urlString) {
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find initial data for '${MangaSlug}', try to scrape manga-list first`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		}

		/*
		Try to scrape manga provider's website
		Return immediately if error
		*/
		const response = await scraper(urlString, "ChapterList", MangaProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(mapToObject(jsonResponse));
		}

		/*
		Give 202 response before processing scraped data
		Inform the requestId, so it can be checked later on
		*/
		const requestId = uuidv4();
		const requestStatus = new Map([
			["EntryId", "request-status"],
			["EntrySlug", requestId],
			["RequestType", `chapter-list_${MangaProvider}_${MangaSlug}`],
			["RequestStatus", "pending"],
		]);
		await db.createStatus(mapToObject(requestStatus));
		jsonResponse = new Map([
			["status", 202],
			["statusText", "Processing request..."],
			["data", { requestId: requestId, requestType: `chapter-list_${MangaProvider}_${MangaSlug}` }],
		]);
		res.status(202).json(mapToObject(jsonResponse));

		/*
		Add each element of scraped chapter list to database
		Skip if already exist in the database
		*/
		const failedItems = new Set();
		for await (const element of response) {
			const data = await db.getEntry(element.get("EntryId"), element.get("EntrySlug"));
			if (data) {
				failedItems.add(`Already exist in the database: '${element.get("EntrySlug")}'`);
				continue;
			} else {
				await db.createEntry(mapToObject(element));
			}
		}

		/*
		Update request status in the database
		Add information of skipped item if any
		*/
		const updatedStatus = new Map([
			["EntryId", "request-status"],
			["EntrySlug", requestId],
			["RequestStatus", "completed"],
			["FailedItems", Array.from(failedItems)],
		]);
		await db.updateStatus(mapToObject(updatedStatus));
	} catch (error) {
		// TODO update status in the database if exist
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
}

/*
Function to scrape a specific chapter from a specific provider
Example:
path: /scrape/chapter
body: { provider: "asura", manga: "damn-reincarnation", slug: "damn-reincarnation-chapter-1" }
*/
async function chapter(req, res) {
	const { provider: MangaProvider, manga: MangaSlug, slug:ChapterSlug } = req.body;
	let jsonResponse;
	try {
		/*
		Try to check database
		Return immediately if other than initial data exist in the database
		Return immediately if nothing exist in the database
		*/
		const { EntryId, ChapterUrl: urlString, ChapterContent } = await db.getEntry(`chapter_${MangaProvider}_${MangaSlug}`, ChapterSlug);
		if (ChapterContent) {
			jsonResponse = new Map([
				["status", 409],
				["statusText", `Already exist in the database: '${ChapterSlug}'`],
			]);
			return res.status(409).json(mapToObject(jsonResponse));
		}
		if (!urlString) {
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find initial data for '${ChapterSlug}', try to scrape chapter-list of '${MangaSlug}' first`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		}
		
		/*
		Try to scrape manga provider's website
		Return immediately if error
		*/
		const response = await scraper(urlString, "Chapter", EntryId);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(mapToObject(jsonResponse));
		}
		
		/*
		Add scraped data to the database
		Return with 201 response
		*/
		await db.updateChapterEntry(mapToObject(response));
		jsonResponse = new Map([
			["status", 201],
			["statusText", "Created"],
			["data", mapToObject(response)],
		]);
		return res.status(201).json(mapToObject(jsonResponse));
	} catch (error) {
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
}

const scrape = {
	mangaList,
	manga,
	chapterList,
	chapter,
};

export default scrape;