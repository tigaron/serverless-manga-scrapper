import logger from "../services/logger";
import providerList from "../utils/providerList";
import mapToObject from "../utils/mapToObject";
import db from "../db";

/*
Function to fetch status of a specific request Id
*/
async function status(req, res) {
	const { id: EntrySlug } = req.params;
	let jsonResponse;
	try {
		const data = await db.getEntry("request-status", EntrySlug);
		if (!data) {
			/*
			Return with 404 if not in the database
			*/
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find '${EntrySlug}' in the database`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		} else {
			/*
			Return with 200 if exist in the database
			*/
			jsonResponse = new Map([
				["status", 200],
				["statusText", "OK"],
				["data", data]
			]);
			return res.status(200).json(mapToObject(jsonResponse));
		}
	} catch (error) {
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
};

/*
Function to fetch list of manga providers
*/
function providerData(req, res) {
	const jsonResponse = new Map([
		["status", 200],
		["statusText", "OK"],
		["data", Array.from(providerList.keys())]
	]);
	return res.status(200).json(mapToObject(jsonResponse));
};

/*
Function to fetch a collection from database
*/
async function listData(req, res) {
	const { provider, slug } = req.params;
	let jsonResponse;
	try {
		const EntryId = slug ? `chapter_${provider}_${slug}` : `manga_${provider}`;
		const data = await db.getCollection(EntryId);
		if (!data) {
			/*
			Return with 404 if not in the database
			*/
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find data collection of '${slug ? slug : provider}' in the database`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		} else {
			/*
			Return with 200 if exist in the database
			*/
			jsonResponse = new Map([
				["status", 200],
				["statusText", "OK"],
				["data", data]
			]);
			return res.status(200).json(mapToObject(jsonResponse));
		}
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
Function to fetch a manga entry from database
*/
async function mangaData(req, res) {
	const { provider, slug } = req.params;
	let jsonResponse;
	try {
		const data = await db.getEntry(`manga_${provider}`, slug);
		if (!data) {
			/*
			Return with 404 if not in the database
			*/
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find '${slug}' in the database`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		} else {
			/*
			Return with 200 if exist in the database
			*/
			jsonResponse = new Map([
				["status", 200],
				["statusText", "OK"],
				["data", data]
			]);
			return res.status(200).json(mapToObject(jsonResponse));
		}
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
Function to fetch a manga entry from database
*/
async function chapterData(req, res) {
	const { provider, manga, slug } = req.params;
	let jsonResponse;
	try {
		const data = await db.getEntry(`chapter_${provider}_${manga}`, slug);
		if (!data) {
			/*
			Return with 404 if not in the database
			*/
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find '${slug}' in the database`],
			]);
			return res.status(404).json(mapToObject(jsonResponse));
		} else {
			/*
			Return with 200 if exist in the database
			*/
			jsonResponse = new Map([
				["status", 200],
				["statusText", "OK"],
				["data", data]
			]);
			return res.status(200).json(mapToObject(jsonResponse));
		}
	} catch (error) {
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(mapToObject(jsonResponse));
	}
}

const fetch = {
	status,
	providerData,
	listData,
	mangaData,
	chapterData,
};

export default fetch;
