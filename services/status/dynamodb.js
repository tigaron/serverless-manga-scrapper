const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, statusTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function getStatus (id) {
  try {
    logger.debug(`In getStatus`);
    const commandParams = {
      'TableName': statusTable,
      'Key': { '_id': id },
    };
    const { Item } = await ddbDocClient.send(new GetCommand(commandParams));
    return Item;
  } catch (error) {
    logger.error(`getStatus failed: `, error.message);
    throw error;
  }
}

module.exports = {
  getStatus,
};
