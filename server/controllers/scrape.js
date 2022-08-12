import { v4 as uuidv4 } from "uuid";
import scraper from "../services/scraper";
import logger from "../services/logger";
import providerList from "../utils";
import db from "../db";

/*
Function to scrape manga list from a specific manga provider
Example:
path: /scrape/manga-list
body: { provider: "asura" }
*/
async function scrapeMangaList(req, res) {
	const { provider: MangaProvider } = req.body;
	const urlString = `${Object.values(providerList.get(MangaProvider)).join("/")}/list-mode/`;
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
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

		/*
		Give 202 response before processing scraped data
		Inform the requestId, so it can be checked later on
		*/
		const requestId = uuidv4();
		const requestStatus = new Map([
			["Id", requestId],
			["RequestType", `manga-list_${MangaProvider}`],
			["RequestStatus", "pending"],
		])
		await db.createStatus(Object.fromEntries(requestStatus));
		jsonResponse = new Map([
			["status", 202],
			["statusText", "Processing request..."],
			["data", { requestId: requestId, requestType: `manga-list_${MangaProvider}` }],
		]);
		res.status(202).json(Object.fromEntries(jsonResponse));
		
		/*
		Add each element of scraped manga list to database
		Skip if already exist in the database
		*/
		const failedItems = new Set();
		for await (const element of response) {
			const data = await db.getEntry(element.get("Id"));
			if (data) {
				failedItems.add(`Already exist in the database: '${element.get("MangaSlug")}'`);
				continue;
			} else {
				await db.createEntry(Object.fromEntries(element));
			}
		}

		/*
		Update request status in the database
		Add information of skipped item if any
		*/
		const updatedStatus = new Map([
			["Id", requestId],
			["RequestStatus", "completed"],
			["FailedItems", failedItems.size ? Array.from(failedItems) : []],
		]);
		await db.updateStatus(Object.fromEntries(updatedStatus));
	} catch (error) {
		logger.error(error.message);
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(Object.fromEntries(jsonResponse));
	}
}

/*
Function to scrape a specific manga from a specific provider
Example:
path: /scrape/manga
body: { provider: "asura", type: "comics", slug: "damn-reincarnation" }
*/
async function scrapeManga(req, res) {
	const {
		provider: MangaProvider,
		type: MangaType,
		slug: MangaSlug,
	} = req.body;
	const urlString = `${providerList.get(MangaProvider).base}/${MangaType}/${MangaSlug}/`;
	let jsonResponse;
	try {
		/*
		Return immediately if already exist in the database
		*/
		const data = await db.getEntry(`manga_${MangaProvider}_${MangaSlug}`);
		if (data) {
			jsonResponse = new Map([
				["status", 409],
				["statusText", `Already exist in the database: '${MangaSlug}'`],
			]);
			return res.status(409).json(Object.fromEntries(jsonResponse));
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
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

		/*
		Add scraped data to the database
		Return with 201 response
		*/
		await db.createEntry(Object.fromEntries(response));
		jsonResponse = new Map([
			["status", 201],
			["statusText", "Created"],
			["data", Object.fromEntries(response)],
		]);
		return res.status(201).json(Object.fromEntries(jsonResponse));
	} catch (error) {
		logger.error(error.message);
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(Object.fromEntries(jsonResponse));
	}
}


/*
Function to scrape chapter list for a specific manga from a specific provider
Example:
path: /scrape/chapter-list
body: { provider: "asura", type: "comics", slug: "damn-reincarnation" }
*/
async function scrapeChapterList(req, res) {
	const {
		provider: MangaProvider,
		type: MangaType,
		slug: MangaSlug,
	} = req.body;
	const urlString = `${providerList.get(MangaProvider).base}/${MangaType}/${MangaSlug}/`;
	let jsonResponse;
	try {
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
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

		/*
		Give 202 response before processing scraped data
		Inform the requestId, so it can be checked later on
		*/
		const requestId = uuidv4();
		const requestStatus = new Map([
			["Id", requestId],
			["RequestType", `chapter-list_${MangaProvider}_${MangaSlug}`],
			["RequestStatus", "pending"],
		])
		await db.createStatus(Object.fromEntries(requestStatus));
		jsonResponse = new Map([
			["status", 202],
			["statusText", "Processing request..."],
			["data", { requestId: requestId, requestType: `chapter-list_${MangaProvider}_${MangaSlug}` }],
		]);
		res.status(202).json(Object.fromEntries(jsonResponse));

		/*
		Add each element of scraped chapter list to database
		Skip if already exist in the database
		*/
		const failedItems = new Set();
		for await (const element of response) {
			const data = await db.getEntry(element.get("Id"));
			if (data) {
				failedItems.add(`Already exist in the database: '${element.get("ChapterSlug")}'`);
				continue;
			} else {
				await db.createEntry(Object.fromEntries(element));
			}
		}

		/*
		Update request status in the database
		Add information of skipped item if any
		*/
		const updatedStatus = new Map([
			["Id", requestId],
			["RequestStatus", "completed"],
			["FailedItems", failedItems.size ? Array.from(failedItems) : []],
		]);
		await db.updateStatus(Object.fromEntries(updatedStatus));
	} catch (error) {
		logger.error(error.message);
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(Object.fromEntries(jsonResponse));
	}
}

/*
Function to scrape a specific chapter from a specific provider
Example:
path: /scrape/chapter
body: { provider: "asura", slug: "damn-reincarnation-01" }
*/
async function scrapeChapter(req, res) {
	const {
		provider: ChapterProvider,
		slug: ChapterSlug,
	} = req.body;
	const urlString = `${providerList.get(ChapterProvider).base}/${ChapterSlug}/`;
	let jsonResponse;
	try {
		/*
		Return immediately if already exist in the database
		*/
		const data = await db.getEntry(`chapter_${ChapterProvider}_${ChapterSlug}`);
		if (data) {
			jsonResponse = new Map([
				["status", 409],
				["statusText", `Already exist in the database: '${ChapterSlug}'`],
			]);
			return res.status(409).json(Object.fromEntries(jsonResponse));
		}
		
		/*
		Try to scrape manga provider's website
		Return immediately if error
		*/
		const response = await scraper(urlString, "Chapter", ChapterProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

		/*
		Add scraped data to the database
		Return with 201 response
		*/
		await db.createEntry(Object.fromEntries(response));
		jsonResponse = new Map([
			["status", 201],
			["statusText", "Created"],
			["data", Object.fromEntries(response)],
		]);
		return res.status(201).json(Object.fromEntries(jsonResponse));
	} catch (error) {
		logger.error(error.message);
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(Object.fromEntries(jsonResponse));
	}
}

export { scrapeMangaList, scrapeManga, scrapeChapterList, scrapeChapter };
