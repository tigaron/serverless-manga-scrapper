import { dbService } from "../services/dbqueries";
import { sourceList } from "../utils/provider";
import logger from "../services/logger";

export const fetchStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await dbService.checkStatus(id);

		if (response.message || !response.data)
			return res.status(404).json({
				statusCode: 404,
				statusText: response.message,
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
					response = await dbService.getMangaList(source);
					break;
				case "manga":
				case "chapter":
					response = await dbService.getEntry(source, type, slug);
					break;
				case "chapters":
					response = await dbService.getChapterList(source, slug);
					break;
			}

			if (response.message || !response.data)
				return res.status(404).json({
					statusCode: 404,
					statusText: response.message,
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
