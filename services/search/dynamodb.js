const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, seriesTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function queryTable (provider, id) {
  try {
    logger.debug(`In queryTable`);
    const commandParams = {
      'TableName': seriesTable,
      'ExpressionAttributeNames': { '#T': '_type', '#I': '_id', '#MS': 'MangaSynopsis' },
      'ExpressionAttributeValues': { ':t': provider, ':i': id },
      'KeyConditionExpression': '#T = :t',
      'FilterExpression': 'contains (#I, :i) OR contains (#MS, :i)',
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

async function scanTable (id) {
  try {
    logger.debug(`In scanTable`);
    const commandParams = {
      'TableName': seriesTable,
      'ExpressionAttributeNames': { '#I': '_id', '#MS': 'MangaSynopsis' },
      'ExpressionAttributeValues': { ':i': id },
      'FilterExpression': 'contains (#I, :i) OR contains (#MS, :i)',
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
