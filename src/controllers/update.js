import { v4 as uuidv4 } from "uuid";
import { update, updateStatus } from "../services/dbqueries.js";
import scraper from "../services/scraper.js";
import { sourceList } from "../utils/provider.js";

export const updateData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.body;
		const url = sourceList.get(source).base + `/${slug.split("+").join("/")}/`;
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
			await update(source, type, slug, response.img, response.title);
			await updateStatus(requestId, "completed");
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
