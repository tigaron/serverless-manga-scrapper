import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dbclient } from "./dbclient";

const marshallOptions = {
	convertEmptyValues: true,
	removeUndefinedValues: true,
	convertClassInstanceToMap: false,
};

const unmarshallOptions = {
	wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

export const dynamodb = DynamoDBDocumentClient.from(dbclient, translateConfig);
