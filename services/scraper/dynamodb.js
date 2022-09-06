const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('logger');

const { region, seriesTable, chapterTable, statusTable } = process.env;

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

async function putItem (table, item) {
  try {
    logger.debug(`In putItem: `, item.get('_id'));
    const commandParams = {
      'TableName': table,
      'Item': item,
      'ExpressionAttributeNames': { '#I': '_id' },
      'ConditionExpression': 'attribute_not_exists(#I)',
    };
    const response = await ddbDocClient.send(new PutCommand(commandParams));
    return false;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') return true;
    logger.error(`putItem failed: `, error.message);
    return error;
  }
}

async function putSeriesCollection (data) {
  try {
    logger.debug(`In putSeriesCollection`);
    const accepted = new Set();
    const rejected = new Set();
    const followup = new Set();
    for await (const element of data) {
      const response = await putItem(seriesTable, element);
      if (response) {
        rejected.add(`"${element.get('_id')}" - Already exist.`);
        continue;
      }
      if (response instanceof Error) {
        rejected.add(`"${element.get('_id')}" - ${response.message}`);
        continue;
      }
      accepted.add(element.get('_id'));
      followup.add(new Map ([
        ['_type', element.get('_type')],
        ['urlToScrape', element.get('MangaUrl')],
      ]));
    }
    const status = {
        'Accepted': accepted.size ? accepted : undefined,
        'Rejected': rejected.size ? rejected : undefined,
    };
    return {
      'followup': followup.size ? followup : undefined,
      'status': status,
    };
  } catch (error) {
    logger.error(`putSeriesCollection failed: `, error.message);
    throw error;
  }
}

async function putChapterCollection (data) {
  try {
    logger.debug(`In putChapterCollection`);
    const accepted = new Set();
    const rejected = new Set();
    const followup = new Set();
    for await (const element of data) {
      const response = await putItem(seriesTable, element);
      if (response) {
        rejected.add(`"${element.get('_id')}" - Already exist.`);
        continue;
      }
      if (response instanceof Error) {
        rejected.add(`"${element.get('_id')}" - ${response.message}`);
        continue;
      }
      accepted.add(element.get('_id'));
      followup.add(new Map ([
        ['_type', element.get('_type')],
        ['urlToScrape', element.get('ChapterUrl')],
      ]));
    }
    const status = {
        'Accepted': accepted.size ? accepted : undefined,
        'Rejected': rejected.size ? rejected : undefined,
    };
    return {
      'followup': followup.size ? followup : undefined,
      'status': status,
    };
  } catch (error) {
    logger.error(`putChapterCollection failed: `, error.message);
    throw error;
  }
}

async function updateSeries (data) {
  try {
    logger.debug(`In updateSeries`);
    const commandParams = {
      'TableName': seriesTable,
      'Key': { '_type': data.get('_type'), '_id': data.get('_id') },
      'ExpressionAttributeNames': {
        '#MT': 'MangaTitle',
        '#MS': 'MangaSynopsis',
        '#MC': 'MangaCover',
        '#SU': 'MangaShortUrl',
        '#SD': 'ScrapeDate',
      },
      'ExpressionAttributeValues': {
        ':mt': data.get('MangaTitle'),
        ':ms': data.get('MangaSynopsis'),
        ':mc': data.get('MangaCover'),
        ':su': data.get('MangaShortUrl'),
        ':sd': data.get('ScrapeDate'),
      },
      'UpdateExpression': 'SET #MT = :mt, #MS = :ms, #MC = :mc, #SU = :su, #SD = :sd',
    };
    const response = await ddbDocClient.send(new UpdateCommand(commandParams));
    const status = response.$metadata.httpStatusCode === 200 ? `Accepted: ${data.get('_id')}` : `Rejected: ${data.get('_id')}`;
    return { 'status': status };
  } catch (error) {
    logger.error(`updateSeries failed: `, error.message);
    throw error;
  }
}

async function updateChapter (data) {
  try {
    logger.debug(`In updateChapter`);
    const commandParams = {
      'TableName': chapterTable,
      'Key': { '_type': data.get('_type'), '_id': data.get('_id') },
      'ExpressionAttributeNames': {
        '#CT': 'ChapterTitle',
        '#CS': 'ChapterShortUrl',
        '#PS': 'ChapterPrevSlug',
        '#NS': 'ChapterNextSlug',
        '#CC': 'ChapterContent',
        '#SD': 'ScrapeDate',
      },
      'ExpressionAttributeValues': {
        ':ct': data.get('ChapterTitle'),
        ':cs': data.get('ChapterShortUrl'),
        ':ps': data.get('ChapterPrevSlug'),
        ':ns': data.get('ChapterNextSlug'),
        ':cc': data.get('ChapterContent'),
        ':sd': data.get('ScrapeDate'),
      },
      'UpdateExpression': 'SET #CT = :ct, #CS = :cs, #PS = :ps, #NS = :ns, #CC = :cc, #SD = :sd',
    };
    const response = await ddbDocClient.send(new UpdateCommand(commandParams));
    const status = response.$metadata.httpStatusCode === 200 ? `Accepted: ${data.get('_id')}` : `Rejected: ${data.get('_id')}`;
    return { 'status': status };
  } catch (error) {
    logger.error(`updateChapter failed: `, error.message);
    throw error;
  }
}

async function updateStatus (id, status, data) {
  try {
    logger.debug(`In updateStatus`);
    const commandParams = {
      'TableName': statusTable,
      'Key': { '_id': id },
      'ExpressionAttributeNames': { '#S': 'Status', '#D': 'Data' },
      'ExpressionAttributeValues': { ':s': status, ':d': data },
      'UpdateExpression': 'SET #S = :s, #D = :d',
    };
    await ddbDocClient.send(new UpdateCommand(commandParams));
  } catch (error) {
    logger.error(`updateStatus failed: `, error.message);
    throw error;
  }
}

async function updateError (id, status, error) {
  try {
    logger.debug(`In updateError`);
    const commandParams = {
      'TableName': statusTable,
      'Key': { '_id': id },
      'ExpressionAttributeNames': { '#S': 'Status', '#E': 'Error' },
      'ExpressionAttributeValues': { ':s': status, ':e': error },
      'UpdateExpression': 'SET #S = :s, #E = :e',
    };
    await ddbDocClient.send(new UpdateCommand(commandParams));
  } catch (error) {
    logger.error(`updateError failed: `, error.message);
    throw error;
  }
}

module.exports = {
  putItem,
  putSeriesCollection,
  putChapterCollection,
  updateSeries,
  updateChapter,
  updateStatus,
  updateError
};
