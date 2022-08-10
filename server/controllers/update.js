import { v4 as uuidv4 } from "uuid";
import scraper from "../services/scraper";
import logger from "../services/logger";
import sourceList from "../utils";
import db from "../db";

export const updateData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.body;
		const url =
			type === "list"
				? Object.values(sourceList.get(source)).join("/") + "/list-mode/"
				: sourceList.get(source).base + `/${slug.split("+").join("/")}/`;

		try {
			const response = await scraper(url, type);

			if (response.message)
				return res.status(404).json({
					statusCode: 404,
					statusText: `Unable to scrape: '${slug}'`,
				});

			const requestId = uuidv4();
			await db.updateStatus(
				requestId,
				"pending",
				`${source}-${type}`,
				slug
			);

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
						result = await db.updateEntry({
							"Provider-Type": `${source}-${type}`,
							Slug: `${item.Slug}`,
							Title: `${item.Title}`,
							Url: `${item.Url}`,
							UpdatedAt: `${timestamp.toUTCString()}`,
						});

						if (result) failedItems.push(result);
					}
					break;
				case "manga":
					result = await db.updateEntry({
						"Provider-Type": `${source}-${type}`,
						Slug: `${slug}`,
						Title: `${response.Title}`,
						Cover: `${response.Cover}`,
						Synopsis: `${response.Synopsis}`,
						UpdatedAt: `${timestamp.toUTCString()}`,
					});

					if (result) failedItems.push(result);

					for await (const item of response.Chapters) {
						result = await db.updateEntry({
							"Provider-Type": `${source}-chapter`,
							Slug: `${item.Slug}`,
							Title: `${item.Title}`,
							Url: `${item.Url}`,
							MangaSlug: `${slug}`,
							MangaTitle: `${response.Title}`,
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
};
