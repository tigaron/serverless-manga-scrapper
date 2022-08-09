import logger from "./logger";
import { dynamodb } from "../configs/dynamodb";
import {
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	DeleteItemCommand,
	QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const { TABLE_MANGA } = process.env;

export const createEntry = async (item, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Item: marshall(item),
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
			"#S": "Slug",
		},
		ExpressionAttributeValues: {
			":pt": marshall(item["Provider-Type"]),
			":s": marshall(item["Slug"]),
		},
		ConditionExpression: "(NOT #PT = :pt) AND (NOT #S = :s)",
	};
	try {
		await dynamodb.send(new PutItemCommand(params));
	} catch (error) {
		// TODO return failed item to be recorded
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.warn(error.message);
	}
};

export const getEntry = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
	};
	try {
		const { Item } = await dynamodb.send(new GetItemCommand(params));
		
		if (Item == undefined) throw new Error(`Unable to find data for '${slug}'`);

		return unmarshall(Item);
	} catch (error) {
		logger.debug(`Get fail: ${provider}-${type} | ${slug}`);
		logger.warn(error.message);
		return error;
	}
};

export const updateEntry = async (item, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Item: marshall(item),
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
			"#S": "Slug",
		},
		ExpressionAttributeValues: {
			":pt": marshall(item["Provider-Type"]),
			":s": marshall(item["Slug"]),
		},
		ConditionExpression: "#PT = :pt AND #S = :s",
	};
	try {
		await dynamodb.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.warn(error.message);
	}
};

export const updateChapter = async (
	provider,
	type,
	slug,
	items,
	title,
	table = TABLE_MANGA
) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
		ExpressionAttributeNames: {
			"#C": "Content",
			"#T": "Title",
		},
		ExpressionAttributeValues: {
			":c": {
				L: items.map((item) => ({ S: item })),
			},
			":t": { S: title },
		},
		UpdateExpression: "SET #C = :c, #T = :t",
	};
	try {
		await dynamodb.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`Update fail: ${provider}-${type} | ${slug}`);
		logger.warn(error.message);
	}
};

export const getMangaList = async (provider, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-list` },
		},
		KeyConditionExpression: "#PT = :pt",
	};
	try {
		const { Items } = await dynamodb.send(new QueryCommand(params));

		if (Items == undefined) throw new Error(`Unable to find data for '${provider}'`);

		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-list`);
		logger.warn(error.message);
		return error;
	}
};

export const getChapterList = async (provider, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
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
		const { Items } = await dynamodb.send(new QueryCommand(params));

		if (Items == undefined) throw new Error(`Unable to find data for '${slug}'`);

		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-chapter | ${slug}`);
		logger.warn(error.message);
		return error;
	}
};

export const updateStatus = async (id, state, type, req, table = TABLE_MANGA) => {
	// TODO add new attribute for failed item
	const item = {
		"Provider-Type": `request-status`,
		Slug: `${id}`,
		Request: `${req}`,
		Type: `${type}`,
		State: `${state}`,
	};
	const params = {
		TableName: table,
		Item: marshall(item),
	};
	try {
		await dynamodb.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.warn(error.message);
	}
};

export const checkStatus = async (id, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `request-status` },
			Slug: { S: `${id}` },
		},
	};
	try {
		const { Item } = await dynamodb.send(new GetItemCommand(params));

		if (Item == undefined) throw new Error(`Unable to find data for '${id}'`);

		return unmarshall(Item);
	} catch (error) {
		logger.debug(`Get fail: request-status | ${id}`);
		logger.warn(error.message);
		return error;
	}
};

export const dbService = {
	createEntry,
	updateEntry,
	updateChapter,
	getEntry,
	getMangaList,
	getChapterList,
	checkStatus,
	updateStatus,
};
