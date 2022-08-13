import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs";
import logger from "../services/logger";

const { TABLE_MANGA } = process.env;

async function getEntry(id, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(id) },
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return Item;
	} catch (error) {
		logger.debug(`getEntry fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function getMangaListElement(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(item["Id"]) },
		ExpressionAttributeNames: {
			"#ML": "MangaList",
			"#MS": item["MangaSlug"],
		},
		ProjectionExpression: "#ML.#MS"
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return Item;
	} catch (error) {
		logger.debug(`getMangaListElement fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function getChapterListElement(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: { Id: marshall(item["Id"]) },
		ExpressionAttributeNames: {
			"#CL": "ChapterList",
			"#CS": item["ChapterSlug"],
		},
		ProjectionExpression: "#CL.#CS"
	};
	try {
		const { Item } = await dbclient.send(new GetItemCommand(params));
		if (Item) return unmarshall(Item);
		else return Item;
	} catch (error) {
		logger.debug(`getChapterListElement fail: ${id}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

export { getEntry, getMangaListElement, getChapterListElement };
