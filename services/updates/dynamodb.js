const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, chapterTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function scanTable (date) {
  try {
    logger.debug(`In scanTable`);
    const commandParams = {
      'TableName': chapterTable,
      'ExpressionAttributeNames': { '#SD': 'ScrapeDate' },
      'ExpressionAttributeValues': { ':d': date },
      'FilterExpression': 'begins_with (#SD, :d)',
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
  scanTable,
};
