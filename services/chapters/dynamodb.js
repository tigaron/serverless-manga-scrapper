const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, paginateQuery } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, seriesTable, chapterTable, statusTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function paginatedChapters (pageSize, pageToGet, provider, id ) {
  try {
    logger.debug(`In paginatedChapters`);
    const paginatorConfig = {
      'client': ddbDocClient,
      'pageSize': pageSize,
    };
    const commandParams = {
      'TableName': chapterTable,
      'ExpressionAttributeNames': { '#T': '_type' },
      'ExpressionAttributeValues': { ':t': `${provider}_${id}` },
      'KeyConditionExpression': '#T = :t',
    };
    const paginator = paginateQuery(paginatorConfig, commandParams);
    const result = new Map();
    let index = 0;
    for await (const { Count, Items, LastEvaluatedKey } of paginator) {
      if (index === pageToGet) {
        if (Count) {
          const prev = pageToGet
            ? `/series/${id}/chapters/?provider=${provider}&page=${pageToGet}&limit=${pageSize}`
            : undefined;
          const next = LastEvaluatedKey
            ? `/series/${id}/chapters/?provider=${provider}&page=${pageToGet + 2}&limit=${pageSize}`
            : undefined;
            result.set('count', Count);
            result.set('prev', prev);
            result.set('next', next);
            result.set('series', Items);
          break;
        }
      } else {
        index++;
        continue;
      }
    }
    return result;
  } catch (error) {
    logger.error(`paginatedChapters failed: `, error.message);
    throw error;
  }
}

async function queryChapters (provider) {
  try {
    logger.debug(`In queryChapters`);
    const commandParams = {
      'TableName': chapterTable,
      'ExpressionAttributeNames': { '#T': '_type' },
      'ExpressionAttributeValues': { ':t': `${provider}_${id}` },
      'KeyConditionExpression': '#T = :t',
    };
    const { Count, Items } = await ddbDocClient.send(new QueryCommand(commandParams));
    const result = new Map();
    if (Count) {
      result.set('count', Count);
      result.set('series', Items);
    }
    return result;
  } catch (error) {
    logger.error(`queryChapters failed: `, error.message);
    throw error;
  }
}

async function addStatus (messageId, postRequest) {
  try {
    logger.debug(`In addStatus`);
    const commandParams = {
      'TableName': statusTable,
      'Item': {
        '_id': messageId,
        'Request': postRequest,
        'Status': 'pending',
      },
    };
    await ddbDocClient.send(new PutCommand(commandParams));
  } catch (error) {
    logger.error(`addStatus failed: `, error.message);
    throw error;
  }
}

async function getSeries (provider, id) {
  try {
    logger.debug(`In getSeries`);
    const commandParams = {
      'TableName': seriesTable,
      'Key': { '_type': provider, '_id': id },
    };
    const { Item } = await ddbDocClient.send(new GetCommand(commandParams));
    return Item;
  } catch (error) {
    logger.error(`getSeries failed: `, error.message);
    throw error;
  }
}

async function getChapter (provider, id, slug) {
  try {
    logger.debug(`In getChapter`);
    const commandParams = {
      'TableName': chapterTable,
      'Key': { '_type': `${provider}_${id}`, '_id': slug },
    };
    const { Item } = await ddbDocClient.send(new GetCommand(commandParams));
    return Item;
  } catch (error) {
    logger.error(`getChapter failed: `, error.message);
    throw error;
  }
}

module.exports = {
  paginatedChapters,
  queryChapters,
  addStatus,
  getSeries,
  getChapter,
};
