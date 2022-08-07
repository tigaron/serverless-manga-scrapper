import { sourceList } from "../utils/provider.js";

export const checkSource = (req, res, next) => {
	const { source } = req.params;
	if (!sourceList.has(source)) {
		return res.status(400).json({
			statusCode: 400,
			statusText: `Unknown source: '${source}'`,
		});
	}
	next();
};

export const checkBody = (type) => {
	return async (req, res, next) => {
		if (!req.is("json"))
			return res.status(406).json({
				statusCode: 406,
				statusText: `Content is not acceptable`,
			});
		const { source, slug } = req.body;
		if (!sourceList.has(source))
			return res.status(400).json({
				statusCode: 400,
				statusText: `Unknown source: '${source}'`,
			});
		if (type !== "list" && !slug)
			return res.status(400).json({
				statusCode: 400,
				statusText: `'slug' is empty`,
			});
		next();
	};
};
