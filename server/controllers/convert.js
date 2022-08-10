// import { v4 as uuidv4 } from "uuid";
import { dbService } from "../services/dbqueries";
import { imgConverter } from "../services/converter";
import logger from "../services/logger";

export const convertImg = async (req, res) => {
	const { source, slug } = req.body;
	try {
		const response = await dbService.getEntry(source, "chapter", slug);
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
		const imgUrl = response.Content;
		const resArr = [];
		for await (element of imgUrl) {
			const result = imgConverter(element);
			resArr.push(result);
		}
		return res.status(201).json({
			statusCode: 201,
			statusText: "Created",
			data: resArr,
		});
	} catch (error) {
		logger.error(error.message);
		return res.status(500).json({
			statusCode: 500,
			statusText: error.message,
		});
	}
};
