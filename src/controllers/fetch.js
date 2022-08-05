import { get } from "../libs/dynamodb.js";
import { sourceList } from "../libs/provider.js";

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
			console.log(response);
			return res.json(response);
		} catch (error) {
			return res.status(500).json({
				statusCode: 500,
				statusText: error.message,
			});
		}
	}
}