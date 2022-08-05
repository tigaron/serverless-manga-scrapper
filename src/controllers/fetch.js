import { get, list } from "../libs/dynamodb.js";
import { sourceList } from "../libs/provider.js";

export const getSourceList = (req, res) => {
	return res.status(200).json({
		statusCode: 200,
		statusText: "OK",
		data: Array.from(sourceList.keys()),
	});
};

// Todo:
// handle 404 for unknown slug, currently return 200 with no data
// cannot fetch list of manga from source, fetchList still returns null, perhaps query logic is not correct 

export const fetchList = () => {
	return async (req, res) => {
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
				data: response
			});
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	}
}

export const fetchData = (type) => {
	return async (req, res) => {
		const { source, slug } = req.params;
		if (!sourceList.has(source)) {
			return res.status(404).json({
				statusCode: 404,
				statusText: `Unable to fetch data from '${source}'`,
			});
		}
		try {
			const response = await get(source, type, slug);
			return res.status(200).json({
				statusCode: 200,
				statusText: "OK",
				data: response
			});
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	}
}