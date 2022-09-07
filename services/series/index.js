const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const logger = require('logger');
const dynamodb = require('./dynamodb');
const addQueue = require('./sqs');

const app = express();

const { scraperQueueUrl } = process.env;

const stream = { write: (message) => logger.info(message.trim()) };
const httpLogger = morgan('short', { stream });

app.use(httpLogger);
app.use(express.json());

const providerMap = new Map([
  ['alpha', 'https://alpha-scans.org/manga/list-mode/'],
  ['asura', 'https://www.asurascans.com/manga/list-mode/'],
  ['flame', 'https://flamescans.org/series/list-mode/'],
  ['luminous', 'https://luminousscans.com/series/list-mode/'],
  ['omega', 'https://omegascans.org/manga/list-mode/'],
  ['realm', 'https://realmscans.com/series/list-mode/'],
]);

function errorHandler(err, req, res, next) {
  logger.error(err.message);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    'status': statusCode,
    'statusText': err.message,
  });
}

app.get('/series', async function (req, res, next) {
  try {
    const { provider, page, limit } = req.query;
    if (!provider) {
      res.status(400);
      throw new Error('Missing query parameter: "provider"');
    }
    if (!providerMap.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    let result = null;
    if (limit && parseInt(limit, 10) > 0) {
      const pageSize = parseInt(limit, 10);
      const pageToGet = page && parseInt(page, 10) - 1 > 0 ? parseInt(page, 10) - 1 : 0;
      result = await dynamodb.paginatedSeries(pageSize, pageToGet, provider);
    } else {
      result = await dynamodb.querySeries(provider);
    }
    logger.debug(`GET series result: `, result);
    if (!result.size()) {
      res.status(404);
      throw new Error(`Not found: "${req.originalUrl}`);
    }
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': Object.fromEntries(result),
    });
  } catch (error) {
    next(error);
  }
});

app.post('/series', async function (req, res, next) {
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
    const postRequest = {
      'urlToScrape': providerMap.get(provider),
      'requestType': 'MangaList',
      'provider': provider,
    };
    const messageId = await addQueue(postRequest);
    await dynamodb.addStatus(messageId, postRequest);
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'requestId': messageId,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/series/:id', async function (req, res, next) {
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
    const series = await dynamodb.getSeries(provider, id);
    logger.debug(`GET series by id result: `, series);
    if (!series) {
      res.status(404);
      throw new Error(`Not found: "${req.originalUrl}`);
    }
    res.status(200).json({
      'status': 200,
      'statusText': 'OK',
      'data': series,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/series/:id', async function (req, res, next) {
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
    const { MangaUrl } = await dynamodb.getSeries(provider, id);
    if (!MangaUrl) {
      res.status(404);
      throw new Error(`Not found: "${req.originalUrl}`);
    }
    const postRequest = {
      'urlToScrape': MangaUrl,
      'requestType': 'Manga',
      'provider': provider,
    };
    const messageId = await addQueue(postRequest);
    await dynamodb.addStatus(messageId, postRequest);
    res.status(202).json({
      'status': 202,
      'statusText': 'Queued',
      'requestId': messageId,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

exports.handler = serverless(app);
