import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dbclient } from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

async function createEntry(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Item: marshall(item),
		ConditionExpression: "attribute_not_exist(Id)",
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`createEntry fail: ${item["Id"]}`);
		logger.debug(error.message);
	}
}

async function createStatus(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Item: marshall(item),
		ConditionExpression: "attribute_not_exist(Id)",
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`createStatus fail: ${item["Id"]}`);
		logger.debug(error.message);
	}
}

export { createEntry, createStatus };
