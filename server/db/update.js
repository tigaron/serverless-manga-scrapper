import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

async function updateMangaListElement(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(item["Id"]) },
		ExpressionAttributeNames: {
			"#ML": "MangaList",
			"#MS": item["MangaSlug"],
			"#UA": item["UpdatedAt"],
		},
		ExpressionAttributeValues: {
			":md": marshall(item["MangaDetail"]),
			":ua": marshall(item["UpdatedAt"]),
		},
		UpdateExpression: "SET #ML.#MS = :md, #UA = :ua"
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateMangaListElement fail: ${item["Id"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function updateChapterListElement(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(item["Id"]) },
		ExpressionAttributeNames: {
			"#CL": "ChapterList",
			"#CS": item["ChapterSlug"],
			"#UA": item["UpdatedAt"],
		},
		ExpressionAttributeValues: {
			":cd": marshall(item["ChapterDetail"]),
			":ua": marshall(item["UpdatedAt"]),
		},
		UpdateExpression: "SET #CL.#CS = :cd, #UA = :ua"
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateChapterListElement fail: ${item["Id"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function updateStatus(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(item["Id"]) },
		ExpressionAttributeNames: {
			"#RS": "RequestStatus",
			"#FI": "FailedItems"
		},
		ExpressionAttributeValues: {
			":rs": marshall(item["RequestStatus"]),
			":fi": marshall(item["FailedItems"]),
		},
		UpdateExpression: "SET #RS = :rs, #FI = :fi"
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateStatus fail: ${item["Id"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
};

export { updateMangaListElement, updateChapterListElement, updateStatus };
