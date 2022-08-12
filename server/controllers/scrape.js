import { v4 as uuidv4 } from "uuid";
import scraper from "../services/scraper";
import logger from "../services/logger";
import providerList from "../utils";
import db from "../db";

/*
/scrape/manga-list
provider: asura

/scrape/manga
provider: asura
type: comics
slug: duke-pendragon

/scrape/chapter-list
provider: asura
type: comics
slug: duke-pendragon

/scrape/chapter
provider: asura
slug: duke-pendragon-1

/fetch/manga-list/asura
/fetch/manga/asura/comics_duke-pendragon
/fetch/chapter-list/asura/comics_duke-pendragon
/fetch/chapter/asura/duke-pendragon-01
*/

async function scrapeMangaList(req, res) {
	const { provider: MangaProvider } = req.body;
	const urlString = `${Object.values(providerList.get(MangaProvider)).join("/")}/list-mode/`;
	let jsonResponse;
	try {
		const response = await scraper(urlString, "MangaList", MangaProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

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
		
		const failedItems = new Set();
		for await (const element of response) {
			const data = await db.getEntry(element.get("Id"));
			if (data) {
				failedItems.add(`Already exist in the database: ${element.get("MangaSlug")}`);
				continue;
			} else {
				await db.createEntry(Object.fromEntries(element));
			}
		}

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

async function scrapeManga(req, res) {
	const {
		provider: MangaProvider,
		type: MangaType,
		slug: MangaSlug,
	} = req.body;
	const urlString = `${providerList.get(MangaProvider).base}/${MangaType}/${MangaSlug}/`;
	let jsonResponse;
	try {
		const data = await db.getEntry(`manga_${MangaProvider}_${MangaSlug}`);
		if (data) {
			jsonResponse = new Map([
				["status", 409],
				["statusText", `Already exist in the database: '${MangaSlug}`],
			]);
			return res.status(409).json(Object.fromEntries(jsonResponse));
		}

		const response = await scraper(urlString, "Manga", MangaProvider);
		if (response.constructor === Error) {
			jsonResponse = new Map([
				["status", response.cause],
				["statusText", response.message],
			]);
			return res.status(response.cause).json(Object.fromEntries(jsonResponse));
		}

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

async function scrapeChapterList(req, res) {
	const {
		provider: MangaProvider,
		type: MangaType,
		slug: MangaSlug,
	} = req.body;
	const urlString = `${providerList.get(MangaProvider).base}/${MangaType}/${MangaSlug}/`;
	let jsonResponse;
	try {
		
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

async function scrapeChapter(req, res) {
}



/* function scrapeData(requestType) {
	return async function (req, res) {
		const { provider, type, slug } = req.body;
		const url =
			type === "list"
				? Object.values(providerList.get(source)).join("/") + "/list-mode/"
				: providerList.get(source).base + `/${slug.split("+").join("/")}/`;

		try {
			const response = await scraper(url, type);

			if (response.message)
				return res.status(404).json({
					statusCode: 404,
					statusText: `Unable to scrape: '${slug}'`,
				});

			const requestId = uuidv4();
			await db.updateStatus(requestId, "pending", `${source}-${type}`, slug);

			res.status(202).json({
				statusCode: 202,
				statusText: slug
					? `Processing data for ${source}-${type} | ${slug}`
					: `Processing data for ${source}-${type}`,
				requestId: requestId,
			});

			const timestamp = new Date();
			let failedItems = [];
			let result;

			switch (type) {
				case "list":
					for await (const item of response) {
						result = await db.createEntry({
							"Provider-Type": `${source}-${type}`,
							Slug: `${item.Slug}`,
							Title: `${item.Title}`,
							Url: `${item.Url}`,
							CreatedAt: `${timestamp.toUTCString()}`,
							UpdatedAt: `${timestamp.toUTCString()}`,
						});

						if (result) failedItems.push(result);
					}
					break;
				case "manga":
					result = await db.createEntry({
						"Provider-Type": `${source}-${type}`,
						Slug: `${slug}`,
						Title: `${response.Title}`,
						Cover: `${response.Cover}`,
						Synopsis: `${response.Synopsis}`,
						CreatedAt: `${timestamp.toUTCString()}`,
						UpdatedAt: `${timestamp.toUTCString()}`,
					});

					if (result) failedItems.push(result);

					for await (const item of response.Chapters) {
						result = await db.createEntry({
							"Provider-Type": `${source}-chapter`,
							Slug: `${item.Slug}`,
							Title: `${item.Title}`,
							Url: `${item.Url}`,
							MangaSlug: `${slug}`,
							MangaTitle: `${response.Title}`,
							CreatedAt: `${timestamp.toUTCString()}`,
							UpdatedAt: `${timestamp.toUTCString()}`,
						});

						if (result) failedItems.push(result);
					}
					break;
				case "chapter":
					result = await db.updateChapter(
						source,
						type,
						slug,
						response.Content,
						response.Title,
						timestamp.toUTCString()
					);

					if (result) failedItems.push(result);
					break;
			}

			await db.updateStatus(
				requestId,
				"completed",
				`${source}-${type}`,
				slug,
				failedItems.filter((item) => item)
			);
		} catch (error) {
			logger.error(error.message);
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
} */

export { scrapeMangaList, scrapeManga, scrapeChapterList, scrapeChapter };
