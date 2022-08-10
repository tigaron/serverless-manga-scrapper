import { v4 as uuidv4 } from "uuid";
import imgConverter from "../services/converter";
import logger from "../services/logger";
import db from "../db";

export const convertImg = async (req, res) => {
	const { source, slug } = req.body;
	try {
		const response = await db.getEntry(source, "chapter", slug);
		if (response.message)
			return res.status(404).json({
				statusCode: 404,
				statusText: response.message,
			});

		const requestId = uuidv4();
		await db.updateStatus(requestId, "pending", `${source}-chapter`, slug);

		res.status(202).json({
			statusCode: 202,
			statusText: `Processing content conversion for ${source}-chapter | ${slug}`,
			requestId: requestId,
		});

		const imgUrl = response.Content;
		const MangaSlug = response.MangaSlug;
		const convertResult = [];
		for await (const item of imgUrl) {
			const newUrl = await imgConverter(source, slug, MangaSlug, item);
			convertResult.push(newUrl);
		}
		const timestamp = new Date();
		let failedItems = [];
		const result = await db.updateContent(
			source,
			slug,
			convertResult,
			timestamp.toUTCString()
		);

		if (result) failedItems.push(result);

		await db.updateStatus(
			requestId,
			"completed",
			`${source}-chapter`,
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
