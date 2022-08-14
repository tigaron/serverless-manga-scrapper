import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

async function getEntry(entryId, entrySlug, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: {
			EntryId: marshall(entryId),
			EntrySlug: marshall(entrySlug),
		},
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return false;
	} catch (error) {
		logger.debug(`getEntry fail: ${entryId}`);
		logger.debug(error.stack);
	}
}

async function getCollection(entryId, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		ExpressionAttributeValues: {
			":ei": marshall(entryId),
		},
		KeyConditionExpression: "EntryId = :ei",
	};
	try {
		const { Items } = await dbclient.send(new QueryCommand(params));
		if (Items) return Items.map((item) => unmarshall(item));
		else return false;
	} catch (error) {
		logger.debug(`getCollection fail: ${entryId}`);
		logger.debug(error.stack);
	}
}

export { getEntry, getCollection };
