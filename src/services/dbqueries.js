import logger from "./logger.js";
import { dynamodb } from "../configs/dynamodb.js";
import {
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	DeleteItemCommand,
	QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const { TABLE_MANGA } = process.env;

export const create = async (item, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Item: marshall(item),
	};
	logger.info(`Put start: ${item["Provider-Type"]} | ${item["Slug"]}`);
	try {
		await dynamodb.send(new PutItemCommand(params));
		logger.info(`Put success: ${item["Provider-Type"]} | ${item["Slug"]}`);
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.debug(error);
	}
};

export const get = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
	};
	logger.info(`Get start: ${provider}-${type} | ${slug}`);
	try {
		const { Item } = await dynamodb.send(new GetItemCommand(params));
		if (Item == undefined) throw new Error(`Unable to find data for '${slug}'`);
		logger.info(`Get success: ${provider}-${type} | ${slug}`);
		return unmarshall(Item);
	} catch (error) {
		logger.debug(`Get fail: ${provider}-${type} | ${slug}`);
		return error;
	}
};

export const update = async (
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
	logger.info(`Update start: ${provider}-${type} | ${slug}`);
	try {
		await dynamodb.send(new UpdateItemCommand(params));
		logger.info(`Update success: ${provider}-${type} | ${slug}`);
	} catch (error) {
		logger.debug(`Update fail: ${provider}-${type} | ${slug}`);
		logger.debug(error);
	}
};

export const list = async (provider, table = TABLE_MANGA) => {
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
	logger.info(`Query start: ${provider}-list`);
	try {
		const { Items } = await dynamodb.send(new QueryCommand(params));
		logger.info(`Query success: ${provider}-list`);
		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-list`);
		return error;
	}
};

export const chapters = async (provider, slug, table = TABLE_MANGA) => {
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
	logger.info(`Query start: ${provider}-chapter | ${slug}`);
	try {
		const { Items } = await dynamodb.send(new QueryCommand(params));
		logger.info(`Query success: ${provider}-chapter | ${slug}`);
		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-chapter | ${slug}`);
		return error;
	}
};

export const updateStatus = async (id, state, table = TABLE_MANGA) => {
	const item = {
		"Provider-Type": `request-status`,
		Slug: `${id}`,
		State: `${state}`,
	};
	const params = {
		TableName: table,
		Item: marshall(item),
	};
	logger.info(`Put start: ${item["Provider-Type"]} | ${item["Slug"]}`);
	try {
		await dynamodb.send(new PutItemCommand(params));
		logger.info(`Put success: ${item["Provider-Type"]} | ${item["Slug"]}`);
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.debug(error);
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
	logger.info(`Get start: request-status | ${id}`);
	try {
		const { Item } = await dynamodb.send(new GetItemCommand(params));
		if (Item == undefined) throw new Error(`Unable to find data for '${id}'`);
		logger.info(`Get success: request-status | ${id}`);
		return unmarshall(Item);
	} catch (error) {
		logger.debug(`Get fail: request-status | ${id}`);
		return error;
	}
};
