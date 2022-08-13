import logger from "../services/logger";
import providerList from "../utils/providerList";
import db from "../db";

/*
Function to fetch status of a specific request Id
*/
async function fetchStatus(req, res) {
	const { id: Id } = req.params;
	let jsonResponse;
	try {
		const data = await db.getEntry(Id);
		if (!data) {
			/*
			Return with 404 if not in the database
			*/
			jsonResponse = new Map([
				["status", 404],
				["statusText", `Cannot find '${Id}' in the database`],
			]);
			return res.status(404).json(Object.fromEntries(jsonResponse));
		} else {
			/*
			Return with 200 if exist in the database
			*/
			jsonResponse = new Map([
				["status", 200],
				["statusText", "OK"],
				["data", data]
			]);
			return res.status(200).json(Object.fromEntries(jsonResponse));
		}
	} catch (error) {
		logger.error(error.message);
		logger.error(error.stack);
		jsonResponse = new Map([
			["status", 500],
			["statusText", error.message],
		]);
		return res.status(500).json(Object.fromEntries(jsonResponse));
	}
};

/*
Function to fetch list of manga providers
*/
function fetchProviderList(req, res) {
	const jsonResponse = new Map([
		["status", 200],
		["statusText", "OK"],
		["data", Array.from(providerList.keys())]
	]);
	return res.status(200).json(Object.fromEntries(jsonResponse));
};

/*
Function to fetch an entry from database
*/
function fetchMangaData(DataType) {
	return async function (req, res) {
		const { provider, slug } = req.params;
		const idDictionary = {
			MangaList: `manga-list_${provider}`,
			Manga: `manga_${provider}_${slug}`,
			ChapterList: `chapter-list_${provider}_${slug}`,
			Chapter: `chapter_${provider}_${slug}`,
		}
		let jsonResponse;
		try {
			const data = await db.getEntry(idDictionary[DataType]);
			if (!data) {
				/*
				Return with 404 if not in the database
				*/
				jsonResponse = new Map([
					["status", 404],
					["statusText", `Cannot find '${idDictionary[DataType]}' in the database`],
				]);
				return res.status(404).json(Object.fromEntries(jsonResponse));
			} else {
				/*
				Return with 200 if exist in the database
				*/
				jsonResponse = new Map([
					["status", 200],
					["statusText", "OK"],
					["data", data]
				]);
				return res.status(200).json(Object.fromEntries(jsonResponse));
			}
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
}

export { fetchStatus, fetchProviderList, fetchMangaData };
