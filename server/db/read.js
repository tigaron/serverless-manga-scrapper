import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { dbclient } from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

const getEntry = async (provider, type, slug, tableName = TABLE_MANGA) => {
	const params = {
		TableName: tableName,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));

		if (Item == undefined) throw new Error(`Unable to find data for '${slug}'`);

		return unmarshall(Item);
	} catch (error) {
		logger.debug(`Get fail: ${provider}-${type} | ${slug}`);
		logger.debug(error.message);
		return error;
	}
};

const getMangaList = async (provider, tableName = TABLE_MANGA) => {
	const params = {
		TableName: tableName,
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-list` },
		},
		KeyConditionExpression: "#PT = :pt",
	};
	try {
		const { Items } = await dbclient.send(new QueryCommand(params));

		if (Items == undefined)
			throw new Error(`Unable to find data for '${provider}'`);

		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-list`);
		logger.debug(error.message);
		return error;
	}
};

const getChapterList = async (provider, slug, tableName = TABLE_MANGA) => {
	const params = {
		TableName: tableName,
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
			"#U": "Url",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-chapter` },
			":ms": { S: `${slug}` },
		},
		KeyConditionExpression: "#PT = :pt",
		FilterExpression: "contains (MangaSlug, :ms)",
		ProjectionExpression: "Title, Slug, #U",
	};
	try {
		const { Items } = await dbclient.send(new QueryCommand(params));

		if (Items == undefined)
			throw new Error(`Unable to find data for '${slug}'`);

		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-chapter | ${slug}`);
		logger.debug(error.message);
		return error;
	}
};

const getStatus = async (id, tableName = TABLE_MANGA) => {
	const params = {
		TableName: tableName,
		Key: {
			"Provider-Type": { S: `request-status` },
			Slug: { S: `${id}` },
		},
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));

		if (Item == undefined) throw new Error(`Unable to find data for '${id}'`);

		const unmappedItems = unmarshall(Item);
		const result = new Map([
			["Provider-Type", unmappedItems["Provider-Type"]],
			["Slug", unmappedItems["Slug"]],
			["Request", unmappedItems["Request"]],
			["Status", unmappedItems["Status"]],
			["FailedItems", unmappedItems["FailedItems"]],
		]);

		return result;
	} catch (error) {
		logger.debug(`Get fail: request-status | ${id}`);
		logger.debug(error.message);
		return error;
	}
};

export { getEntry, getMangaList, getChapterList, getStatus };

