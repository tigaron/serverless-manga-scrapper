import { v4 as uuidv4 } from "uuid";
import { create, update, updateStatus } from "../services/dbqueries.js";
import scraper from "../services/scraper.js";
import { sourceList } from "../utils/provider.js";

export const scrapeData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.body;
		const url =
			type === "list"
				? Object.values(sourceList.get(source)).join("/") + "/list-mode/"
				: sourceList.get(source).base + `/${slug.split("+").join("/")}/`;
		try {
			const response = await scraper(url, type);
			if (response.message)
				return res.status(400).json({
					statusCode: 400,
					statusText: `Unable to scrape: '${slug}'`,
				});
			const requestId = uuidv4();
			res.status(202).json({
				statusCode: 202,
				statusText: "Processing data ...",
				requestId: requestId,
			});
			await updateStatus(requestId, "pending");
			switch (type) {
				case "list":
					for await (const item of response) {
						await create({
							"Provider-Type": `${source}-${type}`,
							Slug: `${item.slug}`,
							Title: `${item.title}`,
							Url: `${item.url}`,
						});
					}
					break;
				case "manga":
					await create({
						"Provider-Type": `${source}-${type}`,
						Slug: `${slug}`,
						Title: `${response.title}`,
						Cover: `${response.cover}`,
						Synopsis: `${response.synopsis}`,
					});
					for await (const item of response.chapters) {
						await create({
							"Provider-Type": `${source}-chapter`,
							Slug: `${item.slug}`,
							Title: `${item.title}`,
							Url: `${item.url}`,
							MangaSlug: `${slug}`,
							MangaTitle: `${response.title}`,
						});
					}
					break;
				case "chapter":
					await update(source, type, slug, response.img, response.title);
					break;
			}
			await updateStatus(requestId, "completed");
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
