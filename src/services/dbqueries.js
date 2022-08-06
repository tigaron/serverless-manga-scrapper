import logger from "./logger.js";
import { dynamodb } from "../configs/dynamodb.js";
import { PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, QueryCommand, } from "@aws-sdk/client-dynamodb";
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

export const list = async (provider, type, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-${type}` },
		},
		KeyConditionExpression: "#PT = :pt",
	};
	logger.info(`Query start: ${provider}-${type}`);
	try {
		const { Items } = await dynamodb.send(new QueryCommand(params));
		logger.info(`Query success: ${provider}-${type}`);
		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-${type}`);
		return error;
	}
};

export const chapters = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		ExpressionAttributeNames: {
			"#PT": "Provider-Type",
			"#U": "Url",
		},
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-${type}` },
			":ms": { S: `${slug}` },
		},
		KeyConditionExpression: "#PT = :pt",
		FilterExpression: "contains (MangaSlug, :ms)",
		ProjectionExpression: "Title, Slug, #U",
	};
	logger.info(`Query start: ${provider}-${type} | ${slug}`);
	try {
		const { Items } = await dynamodb.send(new QueryCommand(params));
		logger.info(`Query success: ${provider}-${type} | ${slug}`);
		return Items.map((item) => unmarshall(item));
	} catch (error) {
		logger.debug(`Query fail: ${provider}-${type} | ${slug}`);
		return error;
	}
};
