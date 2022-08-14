import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs/index.js";
import logger from "../services/logger.js";

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
		logger.debug(`getEntry fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

export { getEntry };
