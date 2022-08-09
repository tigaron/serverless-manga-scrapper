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
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.warn(error.message);
		if (error.message === "The conditional request failed") {
			return `Already exist in database: ${item["Provider-Type"]} | ${item["Slug"]}`;
		} else {
			return `Failed to add to database: ${item["Provider-Type"]} | ${item["Slug"]}`;
		}
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
	timestamp,
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
			"#UT": "UpdatedAt",
		},
		ExpressionAttributeValues: {
			":c": {
				L: items.map((item) => ({ S: item })),
			},
			":t": { S: title },
			":ut": { S: timestamp },
		},
		UpdateExpression: "SET #C = :c, #T = :t, #UT = :ut",
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

		if (Items == undefined)
			throw new Error(`Unable to find data for '${provider}'`);

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

		if (Items == undefined)
			throw new Error(`Unable to find data for '${slug}'`);

		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-chapter | ${slug}`);
		logger.warn(error.message);
		return error;
	}
};

export const updateStatus = async (
	id,
	status,
	type,
	req,
	failed,
	table = TABLE_MANGA
) => {
	const item = {
		"Provider-Type": "request-status",
		Slug: id,
		Request: `${type} | ${req}`,
		Status: status,
		FailedItems: failed ? failed : [],
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

		const unmappedItems = unmarshall(Item);
		const result = new Map();
		result.set("Provider-Type", unmappedItems["Provider-Type"]);
		result.set("Slug", unmappedItems["Slug"]);
		result.set("Request", unmappedItems["Request"]);
		result.set("Status", unmappedItems["Status"]);
		result.set("FailedItems", unmappedItems["FailedItems"]);
		return result;
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
