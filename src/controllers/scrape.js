import scraper from "../libs/scraper.js";

const sourceList = new Map([
	["alpha", { base: "https://alpha-scans.org", slug: "manga" }],
	["asura", { base: "https://www.asurascans.com", slug: "manga" }],
	["flame", { base: "https://flamescans.org", slug: "series" }],
	["luminous", { base: "https://luminousscans.com", slug: "series" }],
	["realm", { base: "https://realmscans.com", slug: "series" }],
]);

export const getSourceList = (req, res) => {
	return res.json({
		list: Array.from(sourceList.keys()),
	});
};

export const scrapeData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.params;
		if (!sourceList.has(source)) {
			return res.status(404).json({
				statusCode: 404,
				statusText: `Unable to scrape data from '${source}'`,
			});
		}
		const url =
			type === "list"
				? Object.values(sourceList.get(source)).join("/") + "/list-mode/"
				: sourceList.get(source).base + `/${slug.split("+").join("/")}/`;
		try {
			const response = await scraper(url, type);
			if (response.statusCode)
				return res.status(response.statusCode).json(response);
			return res.json(response);
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
