import providerList from "../utils/providerList.js";

function validateUUID(req, res, next) {
	const { id } = req.params;
	const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
	if (regex.test(id)) next();
	else return res.status(400).json({
		status: 400,
		statusText: `Not a valid id: '${id}'`,
	});
}

function validateProvider(req, res, next) {
	const { provider } = req.params;
	if (providerList.has(provider)) next();
	else return res.status(404).json({
		status: 404,
		statusText: `Unknown provider: '${provider}'`,
	});
};

function validateBody(items) {
	return async function(req, res, next) {
		if (!req.is("json")) return res.status(406).json({
			status: 406,
			statusText: `Content is not acceptable`,
		});
		const { provider, manga, slug } = req.body;
		const itemsDictionary = {
			Provider: provider,
			ProviderSlug: provider && slug,
			ProviderMangaSlug: provider && manga && slug,
		}
		if (!itemsDictionary[items]) return res.status(400).json({
			status: 400,
			statusText: `Bad request`,
		});
		if (providerList.has(provider)) next();
		else return res.status(404).json({
			status: 404,
			statusText: `Unknown provider: '${provider}'`,
		});
	};
};

export { validateUUID, validateProvider, validateBody };
