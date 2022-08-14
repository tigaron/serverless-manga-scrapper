import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs/index.js";
import logger from "../services/logger.js";

const { TABLE_MANGA } = process.env;

async function createEntry(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Item: marshall(item),
		ConditionExpression: "attribute_not_exists(EntrySlug)",
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`createEntry fail: ${item["EntrySlug"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function createStatus(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Item: marshall(item),
		ConditionExpression: "attribute_not_exists(EntrySlug)",
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`createStatus fail: ${item["EntrySlug"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

export { createEntry, createStatus };
