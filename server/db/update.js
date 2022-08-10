import { PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dbclient } from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

const updateEntry = async (item, tableName = TABLE_MANGA) => {
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
		ConditionExpression: "#PT = :pt AND #S = :s",
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.debug(error.message);
		return `Failed to update database entry: ${item["Provider-Type"]} | ${item["Slug"]}`;
	}
};

const updateChapter = async (
	provider,
	type,
	slug,
	items,
	title,
	timestamp,
	tableName = TABLE_MANGA
) => {
	const params = {
		TableName: tableName,
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
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`Update fail: ${provider}-${type} | ${slug}`);
		logger.debug(error.message);
	}
};

const updateContent = async (
	provider,
	slug,
	items,
	timestamp,
	tableName = TABLE_MANGA
) => {
	const params = {
		TableName: tableName,
		Key: {
			"Provider-Type": { S: `${provider}-chapter` },
			Slug: { S: `${slug}` },
		},
		ExpressionAttributeNames: {
			"#C": "ConvertedContent",
			"#UT": "UpdatedAt",
		},
		ExpressionAttributeValues: {
			":c": {
				L: items.map((item) => ({ S: item })),
			},
			":ut": { S: timestamp },
		},
		UpdateExpression: "SET #C = :c, #UT = :ut",
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`Update fail: ${provider}-${type} | ${slug}`);
		logger.debug(error.message);
	}
};

const updateStatus = async (
	id,
	status,
	type,
	req,
	failed,
	tableName = TABLE_MANGA
) => {
	const item = {
		"Provider-Type": "request-status",
		Slug: id,
		Request: req ? `${type} | ${req}` : `${type}`,
		Status: status,
		FailedItems: failed ? failed : [],
	};
	const params = {
		TableName: tableName,
		Item: marshall(item),
	};
	try {
		await dbclient.send(new PutItemCommand(params));
	} catch (error) {
		logger.debug(`Put fail: ${item["Provider-Type"]} | ${item["Slug"]}`);
		logger.debug(error.message);
	}
};

export { updateEntry, updateChapter, updateContent, updateStatus };
