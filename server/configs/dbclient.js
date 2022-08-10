import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const { REGION } = process.env;

const dynamodb = new DynamoDBClient({ region: REGION });

const marshallOptions = {
	convertEmptyValues: true,
	removeUndefinedValues: true,
	convertClassInstanceToMap: false,
};

const unmarshallOptions = {
	wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

const dbclient = DynamoDBDocumentClient.from(dynamodb, translateConfig);

export default dbclient;
