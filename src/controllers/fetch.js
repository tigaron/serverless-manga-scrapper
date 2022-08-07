import { get, list, chapters, checkStatus } from "../services/dbqueries.js";
import { sourceList } from "../utils/provider.js";

export const getStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await checkStatus(id);
		if (response.message)
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
		return res.status(500).json({
			statusCode: 500,
			statusText: error.message,
		});
	}
}

export const getSourceList = (req, res) => {
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
					response = await list(source);
					break;
				case "manga":
				case "chapter":
					response = await get(source, type, slug);
					break;
				case "chapters":
					response = await chapters(source, slug);
					break;
			}
			if (response.message)
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
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	};
};
