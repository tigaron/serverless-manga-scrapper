import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import dbclient from "../configs/index.js";
import logger from "../services/logger.js";

const { TABLE_MANGA } = process.env;

async function updateMangaEntry(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: {
			EntryId: marshall(item["EntryId"]),
			EntrySlug: marshall(item["EntrySlug"]),
		},
		ExpressionAttributeNames: {
			"#MT": "MangaTitle",
			"#MS": "MangaSynopsis",
			"#MC": "MangaCover",
			"#SU": "MangaShortUrl",
			"#CU": "MangaCanonicalUrl",
			"#SD": "ScrapeDate",
		},
		ExpressionAttributeValues: {
			":mt": marshall(item["MangaTitle"]),
			":ms": marshall(item["MangaSynopsis"]),
			":mc": marshall(item["MangaCover"]),
			":su": marshall(item["MangaShortUrl"]),
			":cu": marshall(item["MangaCanonicalUrl"]),
			":sd": marshall(item["ScrapeDate"]),
		},
		UpdateExpression: "SET #MT = :mt, #MS = :ms, #MC = :mc, #SU = :su, #CU = :cu, #SD = :sd",
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateMangaEntry fail: ${item["EntrySlug"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function updateChapterEntry(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: {
			EntryId: marshall(item["EntryId"]),
			EntrySlug: marshall(item["EntrySlug"]),
		},
		ExpressionAttributeNames: {
			"#CT": "ChapterTitle",
			"#CS": "ChapterShortUrl",
			"#CU": "ChapterCanonicalUrl",
			"#CC": "ChapterContent",
			"#SD": "ScrapeDate",
		},
		ExpressionAttributeValues: {
			":ct": marshall(item["ChapterTitle"]),
			":cs": marshall(item["ChapterShortUrl"]),
			":cu": marshall(item["ChapterCanonicalUrl"]),
			":cc": {
				L: marshall(Array.from(item["ChapterContent"]))
			},
			":sd": marshall(item["ScrapeDate"]),
		},
		UpdateExpression: "SET #CT = :ct, #CS = :cs, #CU = :cu, #CC = :cc, #SD = :sd",
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateChapterEntry fail: ${item["EntrySlug"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
}

async function updateStatus(item, tableName = TABLE_MANGA) {
	const params = {
		TableName: tableName,
		Key: {
			EntryId: marshall(item["EntryId"]),
			EntrySlug: marshall(item["EntrySlug"]),
		},
		ExpressionAttributeNames: {
			"#RS": "RequestStatus",
			"#FI": "FailedItems",
		},
		ExpressionAttributeValues: {
			":rs": marshall(item["RequestStatus"]),
			":fi": {
				L: marshall(item["FailedItems"]),
			},
		},
		UpdateExpression: "SET #RS = :rs, #FI = :fi",
	};
	try {
		await dbclient.send(new UpdateItemCommand(params));
	} catch (error) {
		logger.debug(`updateStatus fail: ${item["EntrySlug"]}`);
		logger.debug(error.message);
		logger.debug(error.stack);
	}
};

export { updateMangaEntry, updateChapterEntry, updateStatus };
