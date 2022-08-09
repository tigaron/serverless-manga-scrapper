import { v4 as uuidv4 } from "uuid";
import { dbService } from "../services/dbqueries";
import { scraper } from "../services/scraper";
import { sourceList } from "../utils/provider";
import logger from "../services/logger";

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
				return res.status(400).json({
					statusCode: 400,
					statusText: `Unable to scrape: '${slug}'`,
				});

			const requestId = uuidv4();
			await dbService.updateStatus(
				requestId,
				"pending",
				`${source}-${type}`,
				slug
			);

			res.status(202).json({
				statusCode: 202,
				statusText: "Processing data ...",
				requestId: requestId,
			});

			const timestamp = new Date();
			let failedItems = [];
			let result;
			switch (type) {
				case "list":
					for await (const item of response) {
						result = await dbService.updateEntry({
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
					result = await dbService.updateEntry({
						"Provider-Type": `${source}-${type}`,
						Slug: `${slug}`,
						Title: `${response.Title}`,
						Cover: `${response.Cover}`,
						Synopsis: `${response.Synopsis}`,
						UpdatedAt: `${timestamp.toUTCString()}`,
					});

					if (result) failedItems.push(result);

					for await (const item of response.Chapters) {
						result = await dbService.updateEntry({
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
					result = await dbService.updateChapter(
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

			await dbService.updateStatus(
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
