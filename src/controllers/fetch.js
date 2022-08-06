import { get, list, chapters } from "../services/dbqueries.js";
import { sourceList } from "../utils/provider.js";

export const getSourceList = (req, res) => {
	return res.status(200).json({
		statusCode: 200,
		statusText: "OK",
		data: Array.from(sourceList.keys()),
	});
};

export const fetchList = async (req, res) => {
	const { source } = req.params;
	if (!sourceList.has(source)) {
		return res.status(404).json({
			statusCode: 404,
			statusText: `Unable to fetch data from '${source}'`,
		});
	}
	try {
		const response = await list(source, "list");
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

export const fetchData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.params;
		if (!sourceList.has(source)) {
			return res.status(404).json({
				statusCode: 404,
				statusText: `Unknows source: '${source}'`,
			});
		}
		try {
			const response = await get(source, type, slug);
			if (response.message)
				return res.status(404).json({
					statusCode: 404,
					statusText: response.message,
				});
			if (type === "manga") {
				response.chapters = await chapters(source, "chapter", slug);
			}
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
