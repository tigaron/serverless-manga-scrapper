import logger from "./logger.js";
import {
	DynamoDBClient,
	PutItemCommand,
	GetItemCommand,
	UpdateItemCommand,
	DeleteItemCommand,
	QueryCommand,
} from "@aws-sdk/client-dynamodb";

const { TABLE_MANGA, REGION } = process.env;
const dynamodb = new DynamoDBClient({ region: REGION });

export const create = async (item, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Item: item,
	};
	logger.info(`Starting: PutItemCommand`);
	try {
		await dynamodb.send(new PutItemCommand(params));
		logger.info(`Finished: PutItemCommand`);
	} catch (error) {
		logger.warn(`Failed: PutItemCommand`);
		return error;
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
	logger.info(`Starting: GetItemCommand`);
	try {
		const data = await dynamodb.send(new GetItemCommand(params));
		logger.info(`Finished: GetItemCommand`);
		return data;
	} catch (error) {
		logger.warn(`Failed: GetItemCommand`);
		return error;
	}
};

// Todo:
// fix passing value of images content, currently returned list of nothing

export const update = async (provider, type, slug, items, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
		UpdateExpression: "set Content = :c",
		ExpressionAttributeValues: {
			":c": {
				L: [
					items.forEach((item) => {
						return { S: item };
					}),
				],
			},
		},
		ReturnValues: "ALL_NEW"
	};
	logger.info(`Starting: UpdateItemCommand`);
	try {
		const data = await dynamodb.send(new UpdateItemCommand(params));
		logger.info(`Finished: UpdateItemCommand`);
		return data;
	} catch (error) {
		logger.warn(`Failed: UpdateItemCommand`);
		return error;
	}
};

export const remove = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Slug: { S: `${slug}` },
		},
		ReturnValues: "ALL_OLD",
	};
	logger.info(`Starting: DeleteItemCommand`);
	try {
		const data = await dynamodb.send(new DeleteItemCommand(params));
		logger.info(`Finished: DeleteItemCommand`);
		return data;
	} catch (error) {
		logger.info(`Failed: DeleteItemCommand`);
		return error;
	}
};

export const list = async (provider, type, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		ExpressionAttributeValues: {
			":pt": { S: `${provider}-${type}` },
		},
		KeyConditionExpression: "Provider-Type = :pt",
	};
	logger.info(`Starting: QueryCommand`);
	try {
		const data = await dynamodb.send(new QueryCommand(params));
		logger.info(`Finished: QueryCommand`);
		return data.Items;
	} catch (error) {
		logger.info(`Failed: QueryCommand`);
		return error;
	}
};
