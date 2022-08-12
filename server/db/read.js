import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

async function getEntry(id, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(id) },
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return Item;
	} catch (error) {
		logger.debug(`getEntry fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function getStatus(id, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(id) },
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return Item;
	} catch (error) {
		logger.debug(`getEntry fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

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
			"#MS": "MangaSlug",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-chapter` },
			":ms": { S: `${slug}` },
		},
		KeyConditionExpression: "#PT = :pt",
		FilterExpression: "#MS = :ms",
	};
	try {
		const data = await dbclient.send(new QueryCommand(params));

		if (data.Items == undefined)
			throw new Error(`Unable to find data for '${slug}'`);

		return data.Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-chapter | ${slug}`);
		logger.debug(error.message);
		return error;
	}
};

export { getEntry, getMangaList, getChapterList, getStatus };
