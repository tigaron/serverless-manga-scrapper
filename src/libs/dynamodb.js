import logger from "./logger.js";
import AWS from "/var/runtime/node_modules/aws-sdk/lib/aws.js";
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });
const { TABLE_MANGA } = process.env;

export const create = async (item, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Item: item,
	};
	logger.info(`Starting: put`);
	await dynamodb.put(params, (error) => {
		if (error) return error;
	logger.info(`Finished: put`);
		return item;
	});
};

export const get = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Title: { S: `${slug}` },
		},
	};
	logger.info(`Starting: get`);
	await dynamodb.get(params, (error, data) => {
		if (error) return error;
	logger.info(`Finished: get`);
	return data.Items;
	});
};

export const remove = async (provider, type, slug, table = TABLE_MANGA) => {
	const params = {
		TableName: table,
		Key: {
			"Provider-Type": { S: `${provider}-${type}` },
			Title: { S: `${slug}` },
		},
		ReturnValues: "ALL_OLD"
	};
	logger.info(`Starting: delete`);
	await dynamodb.delete(params, (error, data) => {
		if (error) return error;
	logger.info(`Finished: delete`);
	return data.Items;
	});
};
