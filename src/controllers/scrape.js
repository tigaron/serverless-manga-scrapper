import scraper from "../libs/scraper.js";
import { create, update } from "../libs/dynamodb.js";
import { sourceList } from "../libs/provider.js";

// Todo:
// scraping manga list from source returns {"message": "Internal Server Error"} instead of 201
// scraping specific manga data takes too long to wait...
   // perhaps we should return immediately with message about scraping job added to queue...
   // or there might be something we can do with the database process for adding chapters

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
			switch (type) {
				case "list":
					for await (const item of response) {
						await create({
							"Provider-Type": { S: `${source}-${type}` },
							Slug: { S: `${item.slug}` },
							Title: { S: `${item.title}` },
							Url: { S: `${item.url}` },
						});
					}
					break;
				case "manga":
					await create({
						"Provider-Type": { S: `${source}-${type}` },
						Slug: { S: `${slug}` },
						Title: { S: `${response.title}` },
						Cover: { S: `${response.cover}` },
						Synopsis: { S: `${response.synopsis}` },
					});
					for await (const item of response.chapters) {
						await create({
							"Provider-Type": { S: `${source}-chapter` },
							Slug: { S: `${item.slug}` },
							Title: { S: `${item.title}` },
							Url: { S: `${item.url}` },
						});
					}
					break;
				case "chapter":
					await update(source, type, slug, response.img);
					break;
			}
			return res.status(201).json({
				statusCode: 201,
				statusText: "Created",
				data: response,
			});
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
