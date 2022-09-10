const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const logger = require('logger');
const dynamodb = require('./dynamodb');

const app = express();

const stream = { write: (message) => logger.info(message.trim()) };
const httpLogger = morgan('short', { stream });

app.use(httpLogger);
app.use(express.json());

const providerSet = new Set([ 'alpha', 'asura', 'flame', 'luminous', 'omega', 'realm' ]);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found: "${req.originalUrl}"`);
  next(error);
}

function errorHandler(err, req, res, next) {
  logger.error(err.message);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    'status': statusCode,
    'statusText': err.message,
  });
}

app.get('/search/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error('Missing your query!');
    }
    const { provider } = req.query;
    if (provider && !providerSet.has(provider)) {
      res.status(404);
      throw new Error(`Unknown provider: "${provider}"`);
    }
    let result = null;
    const decodedIdArray = decodeURIComponent(id).replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '-').split('-').filter(Boolean);
    const EAV = new Map();
    decodedIdArray.forEach((element, index) => EAV.set(`:${element.substring(0, 3)}${index}`, element));
    const FE = decodedIdArray.map((element, index) => `contains (#MS, :${element.substring(0, 3)}${index}) OR contains (#MT, :${element.substring(0, 3)}${index})`).join(' OR ');
    if (provider) {
      EAV.set(`:t`, provider);
      result = await dynamodb.queryTable(Object.fromEntries(EAV), FE);
    } else {
      result = await dynamodb.scanTable(Object.fromEntries(EAV), FE);
    }
    logger.debug(`Search result for "${id}": `, result);
    if (!result.size) {
      res.status(404);
      throw new Error(`Not found: "${req.originalUrl}"`);
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

app.use(notFound);
app.use(errorHandler);

exports.handler = serverless(app);
