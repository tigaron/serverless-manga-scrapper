import logger from "../services/logger";
import sourceList from "../utils";
import db from "../db";

export const fetchStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await db.getStatus(id);

		if (
			response.message ||
			(Array.isArray(response) && response.length === 0) ||
			(response.constructor === Object && Object.keys(response).length === 0)
		)
			return res.status(404).json({
				statusCode: 404,
				statusText: response.message
					? response.message
					: `Unable to find data for '${slug}'`,
			});

		return res.status(200).json({
			statusCode: 200,
			statusText: "OK",
			data: Object.fromEntries(response),
		});
	} catch (error) {
		logger.error(error.message);
		return res.status(500).json({
			statusCode: 500,
			statusText: error.message,
		});
	}
};

export const fetchSourceList = (req, res) => {
	return res.status(200).json({
		statusCode: 200,
		statusText: "OK",
		data: Array.from(sourceList.keys()),
	});
};

export const fetchData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.params;

		try {
			let response;

			switch (type) {
				case "list":
					response = await db.getMangaList(source);
					break;
				case "manga":
				case "chapter":
					response = await db.getEntry(source, type, slug);
					break;
				case "chapters":
					response = await db.getChapterList(source, slug);
					break;
			}

			if (
				response.message ||
				(Array.isArray(response) && response.length === 0) ||
				(response.constructor === Object && Object.keys(response).length === 0)
			)
				return res.status(404).json({
					statusCode: 404,
					statusText: response.message
						? response.message
						: `Unable to find data for '${slug}'`,
				});

			return res.status(200).json({
				statusCode: 200,
				statusText: "OK",
				data: response,
			});
		} catch (error) {
			logger.error(error.message);
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
