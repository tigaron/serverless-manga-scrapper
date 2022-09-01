const express = require('express');
const serverless = require('serverless-http');
const log4js = require('log4js');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { DynamoDBClient, GetItemCommand, PutItemCommand, paginateQuery } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const app = express();

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
    'stack': logLevel === 'info' ? undefined : err.stack,
  });
}

app.get('/series', async (req, res, next) => {
  try {
    const { provider, limit, page } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    const paginatorConfig = {
      'client': new DynamoDBClient({ region: region }),
      'pageSize': limit ? limit : 10,
    };
    const commandParams = {
      'TableName': mangaTable,
      'ExpressionAttributeNames': { '#T': '_type' },
      'ExpressionAttributeValues': { ':t': marshall(`series_${provider}`) },
      'KeyConditionExpression': '#T = :t',
    };
    const paginator = paginateQuery(paginatorConfig, commandParams);
    const series = page ? await paginator[page-1] : await paginator[0];
    logger.debug(paginator);
    logger.debug(series);
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': series,
    });
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
    const scraperData = {
      'urlToScrape': providerMap.get(provider),
      'requestType': 'MangaList',
      'provider': provider,
    };
    const sqsCommandParams = {
      'MessageBody': JSON.stringify(scraperData),
      'QueueUrl': scraperQueueUrl,
    };
    const sqsClient = new SQSClient({ region: region });
    const sqsCommand = new SendMessageCommand(sqsCommandParams);
    const sqsResponse = await sqsClient.send(sqsCommand);
    logger.debug(`SQS response: ${sqsResponse}`);
    const Item = {
      '_type': 'request-status',
      '_id': sqsResponse.MessageId,
      'Request': JSON.stringify(scraperData),
      'Status': 'pending',
    };
    const ddbCommandParams = {
      'TableName': mangaTable,
      'Item': marshall(Item),
    };
    const ddbClient = new DynamoDBClient({ region: region });
    const ddbCommand = new PutItemCommand(ddbCommandParams);
    const ddbResponse = await ddbClient.send(ddbCommand);
    logger.debug(`DynamoDB response: `, ddbResponse);
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'data': Item,
    });
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
    const { id } = req.params;
    const ddbCommandParams = {
      'TableName': mangaTable,
      'Key': { '_type': marshall(`series_${provider}`), '_id': marshall(id) },
    };
    const ddbClient = new DynamoDBClient({ region: region });
    const ddbCommand = new GetItemCommand(ddbCommandParams);
    const ddbResponse = await ddbClient.send(ddbCommand);
    logger.debug(`DynamoDB response: `, ddbResponse);
    if (Object.keys(ddbResponse.Item).length === 0) {
      res.status(404);
      throw new Error(`Not found: "${id}"`);
    }
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': unmarshall(ddbResponse.Item),
    });
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
    const { id } = req.params;
    const ddbCommandParams = {
      'TableName': mangaTable,
      'Key': { '_type': marshall(`series_${provider}`), '_id': marshall(id) },
    };
    const ddbClient = new DynamoDBClient({ region: region });
    const ddbCommand = new GetItemCommand(ddbCommandParams);
    const ddbResponse = await ddbClient.send(ddbCommand);
    logger.debug(`DynamoDB response: `, ddbResponse);
    if (!ddbResponse.Item?.MangaUrl) {
      res.status(404);
      throw new Error(`Not found: "${id}"`);
    }
    const scraperData = {
      'urlToScrape': unmarshall(ddbResponse.Item.MangaUrl),
      'requestType': 'Manga',
      'provider': provider,
    };
    const sqsCommandParams = {
      'MessageBody': JSON.stringify(scraperData),
      'QueueUrl': scraperQueueUrl,
    };
    const sqsClient = new SQSClient({ region: region });
    const sqsCommand = new SendMessageCommand(sqsCommandParams);
    const sqsResponse = await sqsClient.send(sqsCommand);
    logger.debug(`SQS response: `, sqsResponse);
    const Item = {
      '_type': 'request-status',
      '_id': sqsResponse.MessageId,
      'Request': JSON.stringify(scraperData),
      'Status': 'pending',
    };
    const ddbCommandParams2 = {
      'TableName': mangaTable,
      'Item': marshall(Item),
    };
    const ddbClient2 = new DynamoDBClient({ region: region });
    const ddbCommand2 = new PutItemCommand(ddbCommandParams2);
    const ddbResponse2 = await ddbClient2.send(ddbCommand2);
    logger.debug(`DynamoDB response: `, ddbResponse2);
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'data': Item,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

exports.handler = serverless(app);
