import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dbclient } from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

const createEntry = async (item, tableName = TABLE_MANGA) => {
	const params = {
		TableName: tableName,
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
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.debug(error.message);
		if (error.message === "The conditional request failed") {
			return `Already exist in database: ${item["Provider-Type"]} | ${item["Slug"]}`;
		} else {
			return `Failed to add to database: ${item["Provider-Type"]} | ${item["Slug"]}`;
		}
	}
};

export default createEntry;
