const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, seriesTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function queryTable (EAV, FE) {
  try {
    logger.debug(`In queryTable`);
    const commandParams = {
      'TableName': seriesTable,
      'ExpressionAttributeNames': {
        '#T': '_type',
        '#MT': 'MangaTitle',
        '#MS': 'MangaSynopsis',
      },
      'ExpressionAttributeValues': EAV,
      'KeyConditionExpression': '#T = :t',
      'FilterExpression': FE,
    };
    const { Count, Items } = await ddbDocClient.send(new QueryCommand(commandParams));
    const result = new Map();
    if (Count) {
      result.set('count', Count);
      result.set('result', Items);
    }
    return result;
  } catch (error) {
    logger.error(`queryTable failed: `, error.message);
    throw error;
  }
}

async function scanTable (EAV, FE) {
  try {
    logger.debug(`In scanTable`);
    const commandParams = {
      'TableName': seriesTable,
      'ExpressionAttributeNames': {
        '#MT': 'MangaTitle',
        '#MS': 'MangaSynopsis'
      },
      'ExpressionAttributeValues': EAV,
      'FilterExpression': FE,
    };
    const { Count, Items } = await ddbDocClient.send(new ScanCommand(commandParams));
    const result = new Map();
    if (Count) {
      result.set('count', Count);
      result.set('result', Items);
    }
    return result;
  } catch (error) {
    logger.error(`scanTable failed: `, error.message);
    throw error;
  }
}

module.exports = {
  queryTable,
  scanTable,
};
