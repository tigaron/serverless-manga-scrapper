const express = require('express');
const serverless = require('serverless-http');
const log4js = require('log4js');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, paginateQuery } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const app = express();

const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
const unmarshallOptions = { wrapNumbers: false };
const translateConfig = { marshallOptions, unmarshallOptions };

const { region, logLevel, mangaTable, scraperQueueUrl } = process.env;

log4js.configure({
  appenders: { logger: { type: 'console' } },
  categories: { default: { appenders: ['logger'], level: logLevel } },
});

const logger = log4js.getLogger('logger');

const stream = {
  write: (message) => logger.info(message.trim()),
};

const httpLogger = morgan('short', { stream });

app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(express.json());

const providerMap = new Map([
  ['alpha', 'https://alpha-scans.org/manga/list-mode/'],
  ['asura', 'https://www.asurascans.com/manga/list-mode/'],
  ['flame', 'https://flamescans.org/series/list-mode/'],
  ['luminous', 'https://luminousscans.com/series/list-mode/'],
  ['manhwax', 'https://manhwax.com/manga/list-mode/'],
  ['omega', 'https://omegascans.org/manga/list-mode/'],
  ['realm', 'https://realmscans.com/series/list-mode/'],
]);

function errorHandler(err, req, res, next) {
  logger.error(err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    'status': statusCode,
    'statusText': err.message,
  });
}

async function getItem (type, id) {
  try {
    logger.debug(`In getItem`);
    const commandParams = { 'TableName': mangaTable, 'Key': { '_type': type, '_id': id } };
    logger.debug(`getItem command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new GetCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`getItem response: `, response);
    if (response.Item) return response.Item;
    else return false;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function putItem (item) {
  try {
    logger.debug(`In putItem`);
    const commandParams = { 'TableName': mangaTable, 'Item': item };
    logger.debug(`putItem command params: `, commandParams);
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const command = new PutCommand(commandParams);
    const response = await ddbDocClient.send(command);
    logger.debug(`putItem response: `, response);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

app.get('/series', async (req, res, next) => {
  try {
    const { provider, limit, page } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    if (!providerMap.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    const client = new DynamoDBClient({ region: region });
    const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);
    const paginatorConfig = {
      'client': ddbDocClient,
      'pageSize': limit ? parseInt(limit, 10) : 10,
    };
    const commandParams = {
      'TableName': mangaTable,
      'ExpressionAttributeNames': { '#T': '_type' },
      'ExpressionAttributeValues': { ':t': `series_${provider}` },
      'KeyConditionExpression': '#T = :t',
    };
    const paginator = paginateQuery(paginatorConfig, commandParams);
    const pageToGet = page ? parseInt(page - 1, 10) : 0;
    const series = [];
    let count;
    let prev;
    let next;
    let index = 0;
    for await (const value of paginator) {
      if (index === pageToGet) {
        logger.debug(`Page data: `, value);
        for (const item of value.Items) {
          series.push(item);
        }
        count = value.Count;
        prev = pageToGet ? `/series?provider=${provider}&page=${pageToGet}&limit=${limit ? parseInt(limit, 10) : 10}` : undefined;
        next = value.LastEvaluatedKey ? `/series?provider=${provider}&page=${pageToGet + 2}&limit=${limit ? parseInt(limit, 10) : 10}` : undefined;
        break;
      } else {
        index++;
        continue;
      }
    }
    if (page && series.length === 0) {
      res.status(404);
      throw new Error(`Not found: "page=${page}"`);
    }
    if (series.length === 0) {
      res.status(404);
      throw new Error(`No data available`);
    }
    res.status(200).json({ 'status': 200, 'statusText': 'OK', 'count': count, 'prev': prev, 'next': next, 'data': series });
  } catch (error) {
    next(error);
  }
});

app.post('/series', async (req, res, next) => {
  try {
    const { provider } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    if (!providerMap.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    const scraperData = {
      'urlToScrape': providerMap.get(provider),
      'requestType': 'MangaList',
      'provider': provider,
    };
    const sqsCommandParams = {
      'MessageBody': JSON.stringify(scraperData),
      'MessageDeduplicationId': scraperData.urlToScrape,
      'MessageGroupId': scraperData.requestType,
      'QueueUrl': scraperQueueUrl,
    };
    const sqsClient = new SQSClient({ region: region });
    const sqsCommand = new SendMessageCommand(sqsCommandParams);
    const sqsResponse = await sqsClient.send(sqsCommand);
    logger.debug(`SQS response: ${sqsResponse}`);
    const Item = {
      '_type': 'request-status',
      '_id': sqsResponse.MessageId,
      'Request': scraperData,
      'Status': 'pending',
    };
    await putItem(Item);
    res.status(202).json({ 'status': 202, 'statusText': 'Queued', 'data': Item });
  } catch (error) {
    next(error);
  }
});

app.get('/series/:id', async (req, res, next) => {
  try {
    const { provider } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    if (!providerMap.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    const { id } = req.params;
    const ddbResponse = await getItem(`series_${provider}`, id);
    if (!ddbResponse) {
      res.status(404);
      throw new Error(`Not found: "${id}", In: "${provider}"`);
    }
    res.status(200).json({ 'status': 200, 'statusText': 'OK', 'data': ddbResponse });
  } catch (error) {
    next(error);
  }
});

app.post('/series/:id', async (req, res, next) => {
  try {
    const { provider } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    if (!providerMap.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    const { id } = req.params;
    const { MangaUrl, MangaCover } = await getItem(`series_${provider}`, id);
    if (MangaCover) {
      res.status(409);
      throw new Error(`Already scraped: "${id}", In: "${provider}"`);
    }
    if (!MangaUrl) {
      res.status(404);
      throw new Error(`Not found: "${id}", In: "${provider}"`);
    }
    const scraperData = {
      'urlToScrape': MangaUrl,
      'requestType': 'Manga',
      'provider': `series_${provider}`,
    };
    const sqsCommandParams = {
      'MessageBody': JSON.stringify(scraperData),
      'MessageDeduplicationId': scraperData.urlToScrape,
      'MessageGroupId': scraperData.requestType,
      'QueueUrl': scraperQueueUrl,
    };
    const sqsClient = new SQSClient({ region: region });
    const sqsCommand = new SendMessageCommand(sqsCommandParams);
    const sqsResponse = await sqsClient.send(sqsCommand);
    logger.debug(`SQS response: `, sqsResponse);
    const Item = {
      '_type': 'request-status',
      '_id': sqsResponse.MessageId,
      'Request': scraperData,
      'Status': 'pending',
    };
    await putItem(Item);
    res.status(202).json({ 'status': 202, 'statusText': 'Queued', 'data': Item });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

exports.handler = serverless(app);
