import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const { REGION } = process.env;
export const dbclient = new DynamoDBClient({ region: REGION });
