import { create, update } from "../services/dbqueries.js";
import scraper from "../services/scraper.js";
import { sourceList } from "../utils/provider.js";

export const scrapeData = (type) => {
	return async (req, res) => {
		if (req.is("json") !== "json")
			return res.status(406).json({
				statusCode: 406,
				statusText: `Content is not acceptable`,
			});
		const { source, slug } = req.body;
		if (!sourceList.has(source))
			return res.status(400).json({
				statusCode: 400,
				statusText: `Unknows source: '${source}'`,
			});
		if (type !== "list" && !slug)
			return res.status(400).json({
				statusCode: 400,
				statusText: `'slug' is empty`,
			});
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
